import email
from email import policy
import re
import json
import urllib.request

class EmailForensicAnalyzer:
    def __init__(self):
        self.suspicious_keywords = [
            "urgent", "action required", "wire transfer", "bank", 
            "verify account", "password reset", "unauthorized login", "hiring",
            "invoice", "payment", "security alert", "suspended"
        ]

    def _get_live_geo(self, ip):
        """Fetches real-time IP geolocation and ISP information."""
        if not ip or ip == "Unknown" or ip.startswith(("127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.")):
            return {"country": "Internal Network", "city": "Private Subnet", "isp": "Local Infrastructure"}
        
        try:
            url = f"http://ip-api.com/json/{ip}"
            req = urllib.request.urlopen(url, timeout=3)
            data = json.loads(req.read().decode())
            if data.get("status") == "success":
                return {
                    "country": data.get("country", "Unknown"),
                    "city": data.get("city", "Unknown"),
                    "isp": data.get("isp", "Unknown Provider")
                }
        except Exception:
            pass
            
        return {"country": "Unknown", "city": "Unknown", "isp": "Unknown Provider"}

    def analyze(self, raw_text):
        # 1. Parse MIME / RFC822 Structure (handles folded/multi-line headers)
        msg = email.message_from_string(raw_text, policy=policy.default)
        
        from_header = str(msg.get("From", ""))
        to_header = str(msg.get("To", ""))
        subject_header = str(msg.get("Subject", ""))
        auth_results = str(msg.get("Authentication-Results", ""))

        # 2. Extract Public IPs from Received Headers
        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        all_ips = re.findall(ip_pattern, raw_text)
        public_ips = [
            ip for ip in all_ips 
            if not (ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168.") or ip.startswith("172."))
        ]
        
        origin_ip = public_ips[-1] if public_ips else (public_ips[0] if public_ips else "Unknown")

        # 3. Dynamic Authentication Checking
        auth_lower = auth_results.lower()
        raw_lower = raw_text.lower()

        spf = "PASS" if ("spf=pass" in auth_lower or "spf: pass" in raw_lower or "spf=pass" in raw_lower) else ("FAIL" if "spf=fail" in auth_lower or "spf=softfail" in auth_lower else "NONE")
        dkim = "PASS" if ("dkim=pass" in auth_lower or "dkim: pass" in raw_lower or "'pass'" in raw_lower) else ("FAILED" if "dkim=fail" in auth_lower or "dkim=invalid" in auth_lower else "NONE")
        dmarc = "PASS" if ("dmarc=pass" in auth_lower or "dmarc: pass" in raw_lower or "dmarc=pass" in raw_lower) else ("REJECT" if "dmarc=fail" in auth_lower or "dmarc=reject" in auth_lower else "NONE")

        # 4. Extract Domains and URLs
        domains = list(set(re.findall(r'@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', raw_text)))
        sender_domain = domains[0] if domains else "unknown-domain.com"
        urls = list(set(re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', raw_text)))

        # 5. Extract Linguistic Cues
        detected_indicators = []
        for kw in self.suspicious_keywords:
            if re.search(rf"\b{kw}\b", subject_header + " " + raw_text, re.I):
                detected_indicators.append(f"Detected flag: '{kw}'")

        # 6. Real Geolocation Lookup
        geo_info = self._get_live_geo(origin_ip)

        # 7. Dynamic Risk Assessment
        failed_auth_count = sum(1 for status in [spf, dkim, dmarc] if status in ["FAIL", "FAILED", "REJECT"])
        total_risk = 10 + (failed_auth_count * 25) + (len(detected_indicators) * 15)
        if len(urls) > 2:
            total_risk += 15
        total_risk = min(100, total_risk)

        verdict = "MALICIOUS" if total_risk >= 60 else ("SUSPICIOUS" if total_risk >= 35 else "LEGITIMATE")

        # 8. Dynamic Relationship Graph Data
        nodes = [
            {"id": sender_domain, "label": f"Domain: {sender_domain}", "type": "domain"},
            {"id": origin_ip, "label": f"IP: {origin_ip}", "type": "ip"},
            {"id": geo_info["isp"], "label": f"ISP: {geo_info['isp']}", "type": "isp"}
        ]
        if to_header:
            nodes.append({"id": to_header, "label": f"Target: {to_header}", "type": "user"})

        links = [
            {"source": sender_domain, "target": origin_ip, "relation": "SENT_VIA"},
            {"source": origin_ip, "target": geo_info["isp"], "relation": "HOSTED_ON"}
        ]
        if to_header:
            links.append({"source": sender_domain, "target": to_header, "relation": "DELIVERED_TO"})

        return {
            "verdict": verdict,
            "risk_score": total_risk,
            "confidence": 95 if failed_auth_count > 0 or total_risk <= 15 else 80,
            "authentication": {"spf": spf, "dkim": dkim, "dmarc": dmarc},
            "extracted_ip": origin_ip,
            "extracted_domains": domains,
            "urls_found": len(urls),
            "estimated_geo": geo_info,
            "nlp_indicators": detected_indicators if detected_indicators else ["No suspicious urgency cues detected"],
            "graph_relationships": {"nodes": nodes, "links": links}
        }