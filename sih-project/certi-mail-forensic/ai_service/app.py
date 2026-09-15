import email
from email import policy
import re
import json
import urllib.request
import difflib
import base64
import whois
import dns.resolver
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

from classifier import classify_email

app = FastAPI()

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "https://certi-mail-forensic.vercel.app")
INTERNAL_SECRET = os.environ.get("INTERNAL_API_SECRET", "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

HOSTING_VPN_SIGNATURES = [
    "digitalocean", "amazon", "aws", "google cloud", "microsoft azure", "ovh",
    "hetzner", "linode", "vultr", "nordvpn", "expressvpn", "cloudflare",
    "m247", "leaseweb", "contabo", "tor exit"
]

# Commonly impersonated brands — sender domains are checked for near-matches
# against this list to catch lookalike/typosquatted domains.
WATCHED_BRAND_DOMAINS = [
    "paypal.com", "google.com", "microsoft.com", "apple.com", "amazon.com",
    "gmail.com", "outlook.com", "facebook.com", "instagram.com", "netflix.com",
    "bankofamerica.com", "chase.com", "wellsfargo.com", "hdfcbank.com",
    "icicibank.com", "sbi.co.in", "linkedin.com", "dropbox.com", "adobe.com",
]

# File extensions that commonly deliver malware via email attachments
DANGEROUS_EXTENSIONS = [
    '.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.vbe', '.js',
    '.jse', '.wsf', '.wsh', '.ps1', '.msi', '.jar', '.docm', '.xlsm', '.pptm',
    '.dll', '.iso', '.lnk'
]

URL_SHORTENER_DOMAINS = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly',
    'rebrand.ly', 'shorte.st', 'cutt.ly', 'tiny.cc'
]


class EmailPayload(BaseModel):
    raw_text: str


class EmailForensicAnalyzer:
    def __init__(self):
        self.suspicious_keywords = [
            "urgent", "action required", "wire transfer", "bank",
            "verify account", "password reset", "unauthorized login", "hiring",
            "invoice", "payment", "security alert", "suspended"
        ]
        self.ip_cache = {}

    def _get_live_ip_geo(self, ip_address: str):
        if not ip_address or ip_address in ["Unknown", "0.0.0.0"]:
            return {"country": "Unknown", "city": "Unknown", "isp": "Unknown Provider", "lat": 20.5937, "lon": 78.9629, "org": ""}

        if ip_address in self.ip_cache:
            return self.ip_cache[ip_address]

        private_prefixes = ("127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.")
        if ip_address.startswith(private_prefixes):
            return {"country": "Internal Network", "city": "Private Subnet", "isp": "Local Infrastructure", "lat": 0.0, "lon": 0.0, "org": ""}

        try:
            url = f"http://ip-api.com/json/{ip_address}?fields=status,country,city,isp,org,lat,lon"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=4) as response:
                data = json.loads(response.read().decode())
                if data.get("status") == "success":
                    geo_result = {
                        "country": data.get("country", "Unknown"),
                        "city": data.get("city", "Unknown"),
                        "isp": data.get("isp", data.get("org", "Unknown Provider")),
                        "org": data.get("org", ""),
                        "lat": data.get("lat", 20.5937),
                        "lon": data.get("lon", 78.9629)
                    }
                    self.ip_cache[ip_address] = geo_result
                    return geo_result
        except Exception as e:
            print(f"Geo API Error for IP {ip_address}:", e)

        return {"country": "Unknown", "city": "Unknown", "isp": "Unknown Provider", "lat": 20.5937, "lon": 78.9629, "org": ""}

    def _detect_hosting_or_vpn(self, geo_data: dict):
        combined = f"{geo_data.get('isp','')} {geo_data.get('org','')}".lower()
        for sig in HOSTING_VPN_SIGNATURES:
            if sig in combined:
                return {"is_likely_masked": True, "matched_signature": sig}
        return {"is_likely_masked": False, "matched_signature": None}

    def _get_live_whois(self, domain: str):
        try:
            w = whois.whois(domain)
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            return {
                "registrar": w.registrar or "Unknown Registrar",
                "creation_date": str(creation_date).split()[0] if creation_date else "Unknown",
                "dnssec": "Validated" if getattr(w, "dnssec", None) else "Unknown"
            }
        except Exception:
            return {
                "registrar": "Lookup Restricted / Privacy Guard",
                "creation_date": "Unavailable",
                "dnssec": "Unknown"
            }

    def _get_real_mx_records(self, domain: str):
        try:
            answers = dns.resolver.resolve(domain, "MX", lifetime=4)
            records = sorted([str(r.exchange).rstrip('.') for r in answers])
            return records if records else ["No MX records found"]
        except Exception as e:
            return [f"MX lookup failed: {type(e).__name__}"]

    def _extract_received_chain(self, msg):
        received_headers = msg.get_all("Received", [])
        ip_pattern = r'\[?((?:[0-9]{1,3}\.){3}[0-9]{1,3})\]?'
        chain = []
        for hop in received_headers:
            match = re.search(ip_pattern, hop)
            if match:
                ip = match.group(1)
                if not (ip.startswith("127.") or ip.startswith("10.") or
                        ip.startswith("192.168.") or ip.startswith("172.")):
                    chain.append(ip)
        return chain

    def _check_header_alignment(self, msg, from_header, sender_domain):
        return_path = str(msg.get("Return-Path", "")).strip("<>")
        reply_to = str(msg.get("Reply-To", ""))
        issues = []
        if return_path and sender_domain and sender_domain not in return_path:
            issues.append(f"Return-Path domain mismatch: '{return_path}' vs sender domain '{sender_domain}'")
        if reply_to and sender_domain and sender_domain not in reply_to:
            issues.append(f"Reply-To domain differs from sender domain — replies may route elsewhere")
        return issues

    def _check_typosquatting(self, sender_domain: str):
        """Compares the sender domain against a watchlist of commonly
        impersonated brand domains using string similarity. Catches
        lookalikes like 'paypa1.com' or 'micros0ft-support.com'."""
        if not sender_domain:
            return []

        findings = []
        sender_lower = sender_domain.lower()

        for brand in WATCHED_BRAND_DOMAINS:
            if sender_lower == brand:
                continue  # exact match = legitimate, not a lookalike

            brand_name = brand.split('.')[0]
            sender_name = sender_lower.split('.')[0]

            similarity = difflib.SequenceMatcher(None, sender_name, brand_name).ratio()

            # High similarity but not identical = likely typosquat
            if 0.75 <= similarity < 1.0:
                findings.append({
                    "impersonated_brand": brand,
                    "similarity_score": round(similarity * 100, 1)
                })
            # Also catch brand name embedded in a longer suspicious domain
            elif brand_name in sender_lower and sender_lower != brand:
                findings.append({
                    "impersonated_brand": brand,
                    "similarity_score": None,
                    "note": f"Brand name '{brand_name}' embedded in unrelated domain"
                })

        return findings

    def _check_obfuscated_urls(self, urls: list):
        """Flags URLs that use common obfuscation techniques: shorteners,
        raw IP addresses instead of domains, @ symbol redirects, or
        excessive/suspicious subdomain nesting."""
        findings = []

        for url in urls:
            reasons = []
            url_lower = url.lower()

            for shortener in URL_SHORTENER_DOMAINS:
                if shortener in url_lower:
                    reasons.append(f"URL shortener detected ({shortener})")
                    break

            ip_literal_pattern = r'https?://(?:\d{1,3}\.){3}\d{1,3}'
            if re.search(ip_literal_pattern, url):
                reasons.append("Raw IP address used instead of domain name")

            if '@' in url:
                reasons.append("Contains '@' — may redirect to a different host than displayed")

            subdomain_count = url_lower.split('//')[-1].split('/')[0].count('.')
            if subdomain_count >= 4:
                reasons.append(f"Excessive subdomain nesting ({subdomain_count} levels)")

            if '%' in url and len(re.findall(r'%[0-9a-fA-F]{2}', url)) >= 3:
                reasons.append("Heavily URL-encoded — may hide the true destination")

            if reasons:
                findings.append({"url": url, "reasons": reasons})

        return findings

    def _analyze_attachments(self, msg):
        """Walks MIME parts looking for attachments, flags dangerous file
        types and double-extension tricks (e.g. 'invoice.pdf.exe')."""
        findings = []

        for part in msg.walk():
            content_disposition = str(part.get("Content-Disposition", ""))
            filename = part.get_filename()

            if filename:
                filename_lower = filename.lower()
                ext_matches = [ext for ext in DANGEROUS_EXTENSIONS if filename_lower.endswith(ext)]

                double_ext = bool(re.search(r'\.\w{2,4}\.\w{2,4}$', filename_lower))

                if ext_matches or double_ext:
                    reasons = []
                    if ext_matches:
                        reasons.append(f"Dangerous file type: {ext_matches[0]}")
                    if double_ext:
                        reasons.append("Double file extension (possible disguise)")
                    findings.append({"filename": filename, "reasons": reasons})
                elif "attachment" in content_disposition.lower():
                    findings.append({"filename": filename, "reasons": ["Attachment present — verify sender before opening"]})

        return findings

    def analyze(self, raw_text: str):
        msg = email.message_from_string(raw_text, policy=policy.default)

        from_header = str(msg.get("From", ""))
        to_header = str(msg.get("To", ""))
        subject_header = str(msg.get("Subject", ""))
        auth_results = str(msg.get("Authentication-Results", ""))

        received_chain = self._extract_received_chain(msg)
        if received_chain:
            origin_ip = received_chain[-1]
        else:
            ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
            found_ips = re.findall(ip_pattern, raw_text)
            public_ips = [ip for ip in found_ips if not (ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168.") or ip.startswith("172."))]
            origin_ip = public_ips[0] if public_ips else "Unknown"

        domain_pattern = r'@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})'
        found_domains = list(set(re.findall(domain_pattern, raw_text)))
        sender_domain = found_domains[0] if found_domains else "unknown-domain.com"

        auth_lower = auth_results.lower()
        raw_lower = raw_text.lower()

        spf_status = "PASS" if ("spf=pass" in auth_lower or "spf: pass" in raw_lower) else ("FAIL" if "spf=fail" in auth_lower else "NONE")
        dkim_status = "PASS" if ("dkim=pass" in auth_lower or "dkim: pass" in raw_lower) else ("FAILED" if "dkim=fail" in auth_lower else "NONE")
        dmarc_status = "PASS" if ("dmarc=pass" in auth_lower or "dmarc: pass" in raw_lower) else ("REJECT" if "dmarc=fail" in auth_lower else "NONE")

        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
        urls_found = list(set(re.findall(url_pattern, raw_text)))

        body_text = msg.get_body(preferencelist=('plain', 'html'))
        body_str = body_text.get_content() if body_text else raw_text
        ml_label, ml_confidence, ml_probabilities = classify_email(subject_header, body_str)

        nlp_indicators = []
        for kw in self.suspicious_keywords:
            if re.search(rf"\b{kw}\b", subject_header + " " + raw_text, re.I):
                nlp_indicators.append(f"Detected risk cue: '{kw}'")
        if not nlp_indicators:
            nlp_indicators.append("No explicit social engineering keyword cues found")
        nlp_indicators.insert(0, f"ML classifier verdict: '{ml_label}' ({ml_confidence}% confidence)")

        alignment_issues = self._check_header_alignment(msg, from_header, sender_domain)
        typosquat_findings = self._check_typosquatting(sender_domain)
        obfuscated_url_findings = self._check_obfuscated_urls(urls_found)
        attachment_findings = self._analyze_attachments(msg)

        geo_data = self._get_live_ip_geo(origin_ip)
        whois_intelligence = self._get_live_whois(sender_domain)
        mx_records = self._get_real_mx_records(sender_domain)
        masking_check = self._detect_hosting_or_vpn(geo_data)

        auth_dict = {"spf": spf_status, "dkim": dkim_status, "dmarc": dmarc_status}
        failed_auth_count = sum(1 for v in auth_dict.values() if v in ["FAIL", "FAILED", "REJECT"])

        risk_score = 5
        risk_score += (failed_auth_count * 20)
        risk_score += (30 if ml_label == "phishing" else 20 if ml_label == "bec" else 0)
        risk_score += (len(alignment_issues) * 10)
        risk_score += (15 if masking_check["is_likely_masked"] else 0)
        risk_score += (20 if typosquat_findings else 0)
        risk_score += (min(len(obfuscated_url_findings), 3) * 8)
        risk_score += (25 if any('Dangerous file type' in r for f in attachment_findings for r in f['reasons']) else 0)
        if len(urls_found) > 2:
            risk_score += 10
        risk_score = min(risk_score, 100)

        verdict = "MALICIOUS" if risk_score >= 60 else ("SUSPICIOUS" if risk_score >= 35 else "LEGITIMATE")
        campaign_tag = f"CAMPAIGN-{ml_label.upper()}-{sender_domain.split('.')[0].upper()}" if risk_score >= 40 else "CLEAN-TRANSMISSION-BASELINE"

        safe_domain = sender_domain if sender_domain else "unknown-domain.com"
        safe_ip = origin_ip if origin_ip != "Unknown" else "0.0.0.0"
        safe_isp = geo_data.get("isp", "Unknown ISP")

        target_display = "Target Recipient"
        if to_header:
            match = re.search(r'([^<@]+)', to_header)
            target_display = match.group(1).strip() if match else to_header.split('@')[0]

        nodes = [
            {"id": safe_domain, "label": f"Domain: {safe_domain}", "type": "domain"},
            {"id": safe_ip, "label": f"IP: {safe_ip}", "type": "ip"},
            {"id": safe_isp, "label": f"ISP: {safe_isp}", "type": "isp"}
        ]
        if to_header:
            nodes.append({"id": to_header, "label": f"Target: {target_display}", "type": "user"})

        links = [
            {"source": safe_domain, "target": safe_ip, "relation": "SENT_VIA"},
            {"source": safe_ip, "target": safe_isp, "relation": "HOSTED_ON"}
        ]
        if to_header:
            links.append({"source": safe_domain, "target": to_header, "relation": "DELIVERED_TO"})

        return {
            "verdict": verdict,
            "risk_score": risk_score,
            "confidence": ml_confidence,
            "campaign_tag": campaign_tag,
            "ml_classification": {"label": ml_label, "probabilities": ml_probabilities},
            "authentication": auth_dict,
            "header_alignment_issues": alignment_issues if alignment_issues else ["No mismatch detected"],
            "typosquatting_findings": typosquat_findings,
            "obfuscated_url_findings": obfuscated_url_findings,
            "attachment_findings": attachment_findings,
            "extracted_ip": origin_ip,
            "received_chain": received_chain,
            "extracted_domains": found_domains,
            "urls_found": len(urls_found),
            "estimated_geo": geo_data,
            "infrastructure_masking": masking_check,
            "whois_data": whois_intelligence,
            "mx_records": mx_records,
            "nlp_indicators": nlp_indicators,
            "graph_relationships": {"nodes": nodes, "links": links}
        }


analyzer = EmailForensicAnalyzer()


def verify_internal_secret(x_internal_secret: str = Header(default="")):
    if INTERNAL_SECRET and x_internal_secret != INTERNAL_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized: invalid internal service secret")
    return True


@app.post("/analyze")
@app.post("/analyze/")
async def analyze_email(payload: EmailPayload, x_internal_secret: str = Header(default="")):
    verify_internal_secret(x_internal_secret)
    return analyzer.analyze(payload.raw_text)


@app.get("/")
async def root():
    return {"status": "live", "service": "CertiMail Forensic AI Engine"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)