import email
from email import policy
import re
import json
import urllib.request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailPayload(BaseModel):
    raw_text: str


class EmailForensicAnalyzer:
    def __init__(self):
        self.suspicious_keywords = [
            "urgent", "action required", "wire transfer", "bank", 
            "verify account", "password reset", "unauthorized login", "hiring",
            "invoice", "payment", "security alert", "suspended"
        ]
        # Memory Cache to avoid Rate-Limit issues
        self.ip_cache = {}

    def _get_live_ip_geo(self, ip_address: str):
        """Fetches real-time geolocation with local caching."""
        if not ip_address or ip_address == "Unknown":
            return {"country": "Unknown", "city": "Unknown", "isp": "Unknown Provider"}
        
        # Check cache first (Prevents hitting the 45 req/min rate limit)
        if ip_address in self.ip_cache:
            return self.ip_cache[ip_address]

        # Private / Loopback IP check
        private_prefixes = (
            "127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19.", 
            "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", 
            "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31."
        )
        if ip_address.startswith(private_prefixes):
            return {"country": "Internal Network", "city": "Private Subnet", "isp": "Local Infrastructure"}

        try:
            url = f"http://ip-api.com/json/{ip_address}"
            req = urllib.request.urlopen(url, timeout=3)
            data = json.loads(req.read().decode())
            if data.get("status") == "success":
                geo_result = {
                    "country": data.get("country", "Unknown"),
                    "city": data.get("city", "Unknown"),
                    "isp": data.get("isp", "Unknown Provider")
                }
                # Save result in cache
                self.ip_cache[ip_address] = geo_result
                return geo_result
        except Exception as e:
            print("Geo API Lookup Error:", e)

        return {"country": "Unknown", "city": "Unknown", "isp": "Unknown Provider"}

    def analyze(self, raw_text: str):
        msg = email.message_from_string(raw_text, policy=policy.default)
        
        from_header = str(msg.get("From", ""))
        to_header = str(msg.get("To", ""))
        subject_header = str(msg.get("Subject", ""))
        auth_results = str(msg.get("Authentication-Results", ""))
        
        # 1. Extract Public IPs
        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        found_ips = re.findall(ip_pattern, raw_text)
        
        public_ips = []
        for ip in found_ips:
            if not (ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168.") or ip.startswith("172.")):
                if ip not in public_ips:
                    public_ips.append(ip)

        origin_ip = public_ips[-1] if public_ips else (public_ips[0] if public_ips else "Unknown")

        # 2. Extract Domains
        domain_pattern = r'@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})'
        found_domains = list(set(re.findall(domain_pattern, raw_text)))
        sender_domain = found_domains[0] if found_domains else "unknown-domain.com"

        # 3. Dynamic Auth Parsing
        auth_lower = auth_results.lower()
        raw_lower = raw_text.lower()

        spf_status = "PASS" if ("spf=pass" in auth_lower or "spf: pass" in raw_lower) else ("FAIL" if "spf=fail" in auth_lower else "NONE")
        dkim_status = "PASS" if ("dkim=pass" in auth_lower or "dkim: pass" in raw_lower or "'pass'" in raw_lower) else ("FAILED" if "dkim=fail" in auth_lower else "NONE")
        dmarc_status = "PASS" if ("dmarc=pass" in auth_lower or "dmarc: pass" in raw_lower) else ("REJECT" if "dmarc=fail" in auth_lower else "NONE")

        # 4. Extract URLs
        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
        urls_found = list(set(re.findall(url_pattern, raw_text)))

        # 5. Extract NLP Cues
        nlp_indicators = []
        for kw in self.suspicious_keywords:
            if re.search(rf"\b{kw}\b", subject_header + " " + raw_text, re.I):
                nlp_indicators.append(f"Detected risk cue: '{kw}'")

        if not nlp_indicators:
            nlp_indicators.append("No explicit social engineering indicators found in text body")

        # 6. Live Geolocation Lookup (Uses Cache)
        geo_data = self._get_live_ip_geo(origin_ip)

        # 7. Risk Calculation
        auth_dict = {"spf": spf_status, "dkim": dkim_status, "dmarc": dmarc_status}
        failed_auth_count = sum(1 for v in auth_dict.values() if v in ["FAIL", "FAILED", "REJECT"])
        indicator_count = len([i for i in nlp_indicators if "Detected risk cue" in i])

        risk_score = 10
        risk_score += (failed_auth_count * 25)
        risk_score += (indicator_count * 15)
        if len(urls_found) > 2:
            risk_score += 15

        risk_score = min(risk_score, 100)
        verdict = "MALICIOUS" if risk_score >= 60 else ("SUSPICIOUS" if risk_score >= 35 else "LEGITIMATE")

        # 8. Dynamic Graph Data
        nodes = [
            {"id": sender_domain, "label": f"Domain: {sender_domain}", "type": "domain"},
            {"id": origin_ip, "label": f"IP: {origin_ip}", "type": "ip"},
            {"id": geo_data["isp"], "label": f"ISP: {geo_data['isp']}", "type": "isp"}
        ]
        
        if to_header:
            nodes.append({"id": to_header, "label": f"Target: {to_header}", "type": "user"})

        links = [
            {"source": sender_domain, "target": origin_ip, "relation": "SENT_VIA"},
            {"source": origin_ip, "target": geo_data["isp"], "relation": "HOSTED_ON"}
        ]

        if to_header:
            links.append({"source": sender_domain, "target": to_header, "relation": "DELIVERED_TO"})

        return {
            "verdict": verdict,
            "risk_score": risk_score,
            "confidence": 95 if failed_auth_count > 0 or risk_score < 20 else 80,
            "authentication": auth_dict,
            "extracted_ip": origin_ip,
            "extracted_domains": found_domains,
            "urls_found": len(urls_found),
            "estimated_geo": geo_data,
            "nlp_indicators": nlp_indicators,
            "graph_relationships": {"nodes": nodes, "links": links}
        }


analyzer = EmailForensicAnalyzer()

@app.post("/analyze")
async def analyze_email(payload: EmailPayload):
    return analyzer.analyze(payload.raw_text)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)