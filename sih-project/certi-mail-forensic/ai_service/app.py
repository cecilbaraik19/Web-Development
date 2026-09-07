import email
import ipaddress
import json
import os
import re
import urllib.request
from email import policy

import dns.resolver
import whois
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(title="CertiMail Forensic AI Service")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://certi-mail-forensic.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class EmailPayload(BaseModel):
    raw_text: str


# ============================================================
# EMAIL FORENSIC ANALYZER
# ============================================================

class EmailForensicAnalyzer:

    def __init__(self):

        self.suspicious_keywords = [
            "urgent",
            "action required",
            "wire transfer",
            "bank",
            "verify account",
            "password reset",
            "unauthorized login",
            "hiring",
            "invoice",
            "payment",
            "security alert",
            "suspended",
            "click here",
            "confirm your identity",
            "account locked",
            "login",
            "credential",
        ]

        self.ip_cache = {}
        self.whois_cache = {}
        self.dns_cache = {}


    # ========================================================
    # IP GEOLOCATION
    # ========================================================

    def _get_live_ip_geo(self, ip_address: str):

        if not ip_address or ip_address == "Unknown":
            return {
                "country": "Unknown",
                "city": "Unknown",
                "isp": "Unknown Provider",
                "lat": 20.5937,
                "lon": 78.9629,
            }

        if ip_address in self.ip_cache:
            return self.ip_cache[ip_address]

        try:

            ip_obj = ipaddress.ip_address(ip_address)

            if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved:
                return {
                    "country": "Internal Network",
                    "city": "Private/Reserved Network",
                    "isp": "Local Infrastructure",
                    "lat": 0.0,
                    "lon": 0.0,
                }

        except ValueError:
            return {
                "country": "Unknown",
                "city": "Unknown",
                "isp": "Unknown Provider",
                "lat": 20.5937,
                "lon": 78.9629,
            }

        try:

            url = f"https://ip-api.com/json/{ip_address}?fields=status,country,city,isp,org,lat,lon"

            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "CertiMail-Forensic-Analyzer/1.0"
                },
            )

            with urllib.request.urlopen(request, timeout=5) as response:

                data = json.loads(
                    response.read().decode("utf-8")
                )

                if data.get("status") == "success":

                    geo_result = {
                        "country": data.get("country", "Unknown"),
                        "city": data.get("city", "Unknown"),
                        "isp": data.get(
                            "isp",
                            data.get("org", "Unknown Provider")
                        ),
                        "lat": data.get("lat", 20.5937),
                        "lon": data.get("lon", 78.9629),
                    }

                    self.ip_cache[ip_address] = geo_result

                    return geo_result

        except Exception as error:

            print(
                f"Geo API Error for {ip_address}: {error}"
            )

        return {
            "country": "Unknown",
            "city": "Unknown",
            "isp": "Unknown Provider",
            "lat": 20.5937,
            "lon": 78.9629,
        }


    # ========================================================
    # WHOIS
    # ========================================================

    def _get_live_whois(self, domain: str):

        if not domain or domain == "unknown-domain.com":
            return {
                "registrar": "Unknown",
                "creation_date": "Unknown",
                "mx_records": [],
                "dnssec": "Unknown",
            }

        if domain in self.whois_cache:
            return self.whois_cache[domain]

        result = {
            "registrar": "Unknown Registrar",
            "creation_date": "Unknown",
            "mx_records": [],
            "dnssec": "Unknown",
        }

        # ----------------------------------------------------
        # WHOIS
        # ----------------------------------------------------

        try:

            w = whois.whois(domain)

            registrar = getattr(w, "registrar", None)
            creation_date = getattr(w, "creation_date", None)

            if isinstance(creation_date, list):
                creation_date = creation_date[0]

            result["registrar"] = (
                str(registrar)
                if registrar
                else "Unknown Registrar"
            )

            result["creation_date"] = (
                str(creation_date).split()[0]
                if creation_date
                else "Unknown"
            )

        except Exception as error:

            print(
                f"WHOIS lookup failed for {domain}: {error}"
            )

            result["registrar"] = (
                "Lookup Restricted / Privacy Guard"
            )


        # ----------------------------------------------------
        # REAL MX RECORDS
        # ----------------------------------------------------

        try:

            mx_answers = dns.resolver.resolve(
                domain,
                "MX",
                lifetime=5
            )

            mx_records = []

            for answer in mx_answers:
                mx_records.append(
                    str(answer.exchange).rstrip(".")
                )

            result["mx_records"] = mx_records

        except Exception as error:

            print(
                f"MX lookup failed for {domain}: {error}"
            )

            result["mx_records"] = []


        # ----------------------------------------------------
        # DNSSEC CHECK
        # ----------------------------------------------------

        try:

            resolver = dns.resolver.Resolver()

            response = resolver.resolve(
                domain,
                "DNSKEY",
                lifetime=5
            )

            if response:

                result["dnssec"] = "DNSKEY PRESENT"

        except dns.resolver.NoAnswer:

            result["dnssec"] = "NO DNSKEY"

        except dns.resolver.NXDOMAIN:

            result["dnssec"] = "DOMAIN NOT FOUND"

        except Exception as error:

            print(
                f"DNSSEC lookup failed for {domain}: {error}"
            )

            result["dnssec"] = "UNKNOWN"


        self.whois_cache[domain] = result

        return result


    # ========================================================
    # EXTRACT PUBLIC IP
    # ========================================================

    def _extract_public_ips(self, raw_text):

        ip_pattern = (
            r"\b(?:"
            r"(?:25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\."
            r"){3}"
            r"(?:25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})\b"
        )

        candidates = re.findall(
            ip_pattern,
            raw_text
        )

        public_ips = []

        for ip in candidates:

            try:

                ip_obj = ipaddress.ip_address(ip)

                if (
                    ip_obj.version == 4
                    and ip_obj.is_global
                ):
                    public_ips.append(ip)

            except ValueError:
                continue

        return list(dict.fromkeys(public_ips))


    # ========================================================
    # EXTRACT SENDER DOMAIN
    # ========================================================

    def _extract_sender_domain(self, from_header):

        match = re.search(
            r"@([A-Za-z0-9.-]+\.[A-Za-z]{2,})",
            from_header
        )

        if match:
            return match.group(1).lower()

        return "unknown-domain.com"


    # ========================================================
    # ANALYZE EMAIL
    # ========================================================

    def analyze(self, raw_text: str):

        if not raw_text.strip():

            return {
                "verdict": "UNKNOWN",
                "risk_score": 0,
                "confidence": 0,
                "message": "No email content supplied.",
            }


        # ----------------------------------------------------
        # Parse Email
        # ----------------------------------------------------

        msg = email.message_from_string(
            raw_text,
            policy=policy.default
        )

        from_header = str(
            msg.get("From", "")
        )

        to_header = str(
            msg.get("To", "")
        )

        subject_header = str(
            msg.get("Subject", "")
        )

        authentication_results = str(
            msg.get("Authentication-Results", "")
        )

        received_headers = msg.get_all(
            "Received",
            []
        )


        # ----------------------------------------------------
        # IP EXTRACTION
        # ----------------------------------------------------

        found_ips = self._extract_public_ips(
            raw_text
        )

        origin_ip = (
            found_ips[0]
            if found_ips
            else "Unknown"
        )


        # ----------------------------------------------------
        # DOMAIN EXTRACTION
        # ----------------------------------------------------

        sender_domain = (
            self._extract_sender_domain(
                from_header
            )
        )

        domain_pattern = (
            r"\b(?:"
            r"[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}"
            r"[a-zA-Z0-9])?\."
            r")+[a-zA-Z]{2,}\b"
        )

        found_domains = list(
            dict.fromkeys(
                re.findall(
                    domain_pattern,
                    raw_text
                )
            )
        )

        found_domains = [
            domain.lower()
            for domain in found_domains
        ]


        # ----------------------------------------------------
        # AUTHENTICATION
        # ----------------------------------------------------

        auth_lower = (
            authentication_results.lower()
        )

        raw_lower = raw_text.lower()


        if "spf=pass" in auth_lower:
            spf_status = "PASS"

        elif "spf=fail" in auth_lower:
            spf_status = "FAIL"

        elif "spf=softfail" in auth_lower:
            spf_status = "SOFTFAIL"

        else:
            spf_status = "NONE"


        if "dkim=pass" in auth_lower:
            dkim_status = "PASS"

        elif "dkim=fail" in auth_lower:
            dkim_status = "FAILED"

        else:
            dkim_status = "NONE"


        if "dmarc=pass" in auth_lower:
            dmarc_status = "PASS"

        elif "dmarc=fail" in auth_lower:
            dmarc_status = "REJECT"

        else:
            dmarc_status = "NONE"


        # ----------------------------------------------------
        # URL EXTRACTION
        # ----------------------------------------------------

        url_pattern = (
            r"https?://[^\s<>\"']+"
            r"|www\.[^\s<>\"']+"
        )

        urls_found = list(
            dict.fromkeys(
                re.findall(
                    url_pattern,
                    raw_text,
                    re.IGNORECASE
                )
            )
        )


        # ----------------------------------------------------
        # NLP / SOCIAL ENGINEERING INDICATORS
        # ----------------------------------------------------

        nlp_indicators = []

        searchable_text = (
            subject_header
            + " "
            + raw_lower
        )

        for keyword in self.suspicious_keywords:

            if re.search(
                rf"\b{re.escape(keyword)}\b",
                searchable_text,
                re.IGNORECASE
            ):

                nlp_indicators.append(
                    f"Detected risk cue: '{keyword}'"
                )


        if not nlp_indicators:

            nlp_indicators.append(
                "No explicit social engineering indicators found in text body"
            )


        # ----------------------------------------------------
        # REAL EXTERNAL INTELLIGENCE
        # ----------------------------------------------------

        geo_data = self._get_live_ip_geo(
            origin_ip
        )

        whois_intelligence = self._get_live_whois(
            sender_domain
        )


        # ----------------------------------------------------
        # RISK SCORE
        # ----------------------------------------------------

        auth_dict = {
            "spf": spf_status,
            "dkim": dkim_status,
            "dmarc": dmarc_status,
        }

        failed_auth_count = sum(
            1
            for value in auth_dict.values()
            if value in [
                "FAIL",
                "FAILED",
                "REJECT",
                "SOFTFAIL"
            ]
        )

        indicator_count = len(
            [
                item
                for item in nlp_indicators
                if "Detected risk cue" in item
            ]
        )


        risk_score = 10

        risk_score += (
            failed_auth_count * 25
        )

        risk_score += (
            indicator_count * 10
        )

        if len(urls_found) > 2:
            risk_score += 15

        if origin_ip != "Unknown":
            risk_score += 5

        if (
            whois_intelligence["dnssec"]
            == "NO DNSKEY"
        ):
            risk_score += 5

        risk_score = min(
            risk_score,
            100
        )


        # ----------------------------------------------------
        # VERDICT
        # ----------------------------------------------------

        if risk_score >= 60:

            verdict = "MALICIOUS"

        elif risk_score >= 35:

            verdict = "SUSPICIOUS"

        else:

            verdict = "LEGITIMATE"


        campaign_tag = (
            "CAMPAIGN-FIN-2026-ALPHA"
            if risk_score >= 40
            else "CLEAN-TRANSMISSION-BASELINE"
        )


        confidence = (
            95
            if failed_auth_count > 0
            else 85
        )


        # ----------------------------------------------------
        # TARGET
        # ----------------------------------------------------

        target_display = "Target Recipient"

        if to_header:

            match = re.search(
                r"([^<@]+)",
                to_header
            )

            if match:

                target_display = (
                    match.group(1).strip()
                )

            else:

                target_display = (
                    to_header.split("@")[0]
                )


        # ----------------------------------------------------
        # SAFE VALUES
        # ----------------------------------------------------

        safe_domain = sender_domain

        safe_ip = (
            origin_ip
            if origin_ip != "Unknown"
            else "0.0.0.0"
        )

        safe_isp = geo_data.get(
            "isp",
            "Unknown ISP"
        )


        # ----------------------------------------------------
        # THREAT GRAPH
        # ----------------------------------------------------

        nodes = [

            {
                "id": safe_domain,
                "label": f"Domain: {safe_domain}",
                "type": "domain",
            },

            {
                "id": safe_ip,
                "label": f"IP: {safe_ip}",
                "type": "ip",
            },

            {
                "id": safe_isp,
                "label": f"ISP: {safe_isp}",
                "type": "isp",
            },
        ]


        if to_header:

            nodes.append(
                {
                    "id": to_header,
                    "label": f"Target: {target_display}",
                    "type": "user",
                }
            )


        links = [

            {
                "source": safe_domain,
                "target": safe_ip,
                "relation": "SENT_VIA",
            },

            {
                "source": safe_ip,
                "target": safe_isp,
                "relation": "HOSTED_ON",
            },
        ]


        if to_header:

            links.append(
                {
                    "source": safe_domain,
                    "target": to_header,
                    "relation": "DELIVERED_TO",
                }
            )


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        return {

            "verdict": verdict,

            "risk_score": risk_score,

            "confidence": confidence,

            "campaign_tag": campaign_tag,

            "authentication": auth_dict,

            "extracted_ip": origin_ip,

            "extracted_domains": found_domains,

            "sender_domain": sender_domain,

            "urls_found": len(urls_found),

            "urls": urls_found,

            "estimated_geo": geo_data,

            "whois_data": whois_intelligence,

            "nlp_indicators": nlp_indicators,

            "graph_relationships": {
                "nodes": nodes,
                "links": links,
            },
        }


# ============================================================
# GLOBAL ANALYZER
# ============================================================

analyzer = EmailForensicAnalyzer()


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
async def root():

    return {
        "status": "success",
        "service": "CertiMail Forensic AI Service",
        "message": "Python AI service is live",
        "endpoint": "POST /analyze",
    }


# ============================================================
# ANALYZE ENDPOINT
# ============================================================

@app.post("/analyze")
async def analyze_email(
    payload: EmailPayload
):

    return analyzer.analyze(
        payload.raw_text
    )


# ============================================================
# RENDER START
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            8000
        )
    )

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port
    )