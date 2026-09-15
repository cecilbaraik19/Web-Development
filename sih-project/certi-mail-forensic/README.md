# 🛡️ CertiMail Forensics

### AI-Powered Email Threat Detection, Geolocation & Forensic Intelligence Platform

<p align="center">

**Built for Smart India Hackathon — Problem Statement 26106**

**AICTE Cyber Security Cell**

</p>

<p align="center">

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/AI-Python-3776AB?logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/Cloud-Render%20%2B%20Vercel-000000?logo=vercel\&logoColor=white)](https://vercel.com/)

</p>

---

## 🚨 What is CertiMail Forensics?

**CertiMail Forensics** is an AI-powered email investigation platform designed to detect, analyze, trace and correlate suspicious emails.

Instead of simply answering:

> ❌ "Is this email phishing?"

the platform goes further:

> 🔎 **Who sent it?**
> 🌍 **Where did it originate?**
> 🧬 **What infrastructure is connected to it?**
> 🔗 **Is it related to previous cases?**
> 📋 **Can we generate a forensic investigation report?**

The system combines **Machine Learning + Email Header Forensics + IP Intelligence + DNS/WHOIS + Threat Reputation + Graph Correlation** into one interactive investigation dashboard.

---

# 🚀 Live Demo

| 🌐 Service             | 🔗 Access                                                                  |
| ---------------------- | -------------------------------------------------------------------------- |
| 🖥️ Frontend Dashboard | [**Open Dashboard**](https://certi-mail-forensic.vercel.app/)              |
| ⚙️ Backend API         | [**Open Backend**](https://certimail-forensic.onrender.com)                |
| 🤖 AI Service          | [**Open AI Service**](https://certimail-forensic-ai-service.onrender.com/) |

### ⚠️ Render Free-Tier Cold Start

The backend and AI service run on Render's free tier.

After inactivity, Render may put the services to sleep.

If the dashboard initially shows a connection error:

1. Open the **Backend API**
2. Wait until it returns a JSON response
3. Open the **AI Service**
4. Wait until it returns a JSON response
5. Return to the dashboard
6. Start the investigation

⏱️ Cold starts can take approximately **30–60 seconds per service**.

This is a hosting limitation of the free tier rather than an application-level dependency.

---

# 🎯 Problem Statement

Traditional email security solutions often rely heavily on:

* 🚫 Spam filters
* 📛 Static blacklists
* 🔐 Signature-based rules
* 🧱 Domain reputation

Modern phishing campaigns can bypass these mechanisms using:

```text
Spoofed Domains
      ↓
Display Name Impersonation
      ↓
URL Obfuscation
      ↓
Malicious Attachments
      ↓
Compromised Mail Servers
      ↓
Relay / Proxy Infrastructure
      ↓
Target Victim
```

CertiMail Forensics combines multiple independent investigation techniques to provide a broader forensic picture.

---

# 🧠 How It Works

```text
                📧 RAW EMAIL
                     │
                     ▼
          ┌─────────────────────┐
          │   Email Parser      │
          │ MIME / RFC822       │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   ML Classifier     │
          │ TF-IDF + Logistic   │
          │ Regression          │
          └──────────┬──────────┘
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
   🔗 URL Check   📎 Attachment   🧬 Identity
                  Analysis        Analysis
        │            │             │
        └────────────┼─────────────┘
                     ▼
          ┌─────────────────────┐
          │ Header Forensics    │
          │ SPF / DKIM / DMARC  │
          │ Received Chain      │
          └──────────┬──────────┘
                     │
                     ▼
          🌍 Origin IP Detection
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       GeoIP       WHOIS       DNS
          │          │          │
          └──────────┼──────────┘
                     ▼
          🔍 Threat Intelligence
                     │
                     ▼
          🔗 Case Correlation
                     │
                     ▼
          📊 Investigation Graph
                     │
                     ▼
          📄 Forensic Report
```

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                     👤 ANALYST                           │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                  🖥️ REACT DASHBOARD                      │
│                    Vercel                                │
│                                                          │
│  📊 Dashboard   🔍 Investigation   🗂️ Cases              │
│  🕸️ Threat Graph   📜 Audit Logs   📄 Reports            │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTPS
                          ▼
┌──────────────────────────────────────────────────────────┐
│                 ⚙️ NODE / EXPRESS API                    │
│                       Render                             │
│                                                          │
│  Investigation │ Cases │ Correlation │ Audit │ Alerts   │
└───────────────┬──────────────────────┬───────────────────┘
                │                      │
                │                      │
                ▼                      ▼
      ┌──────────────────┐    ┌─────────────────────┐
      │ 🍃 MongoDB Atlas │    │ 🤖 Python FastAPI   │
      │                  │    │       Render        │
      │ Investigations   │    │                     │
      │ Audit Logs       │    │ ML Classification   │
      │ Case History     │    │ Header Forensics    │
      └──────────────────┘    │ IP Intelligence     │
                              │ DNS / WHOIS         │
                              └─────────────────────┘
```

---

# 🔥 Core Features

## 🤖 AI Threat Detection

### ML Classification

Uses:

```text
Email Content
     ↓
Text Preprocessing
     ↓
TF-IDF Vectorization
     ↓
Logistic Regression
     ↓
Threat Classification
```

Classifies emails into:

| Classification    | Meaning                                     |
| ----------------- | ------------------------------------------- |
| 🟢 Legitimate     | No significant phishing indicators detected |
| 🟠 Suspicious     | Multiple suspicious indicators detected     |
| 🔴 Phishing / BEC | Strong malicious indicators detected        |

---

## 🕵️ Email Forensics

The forensic engine examines:

* 📩 MIME/RFC822 headers
* 🔐 SPF
* 🔑 DKIM
* 🛡️ DMARC
* ↩️ Return-Path
* 💬 Reply-To
* 📡 Received headers
* 🌐 Origin IP
* 🏢 Sending infrastructure

---

## 🌍 Origin Traceability

CertiMail reconstructs the email's `Received` header chain.

```text
Mail Client
     ↓
Mail Server
     ↓
Relay Server
     ↓
Intermediate Server
     ↓
Destination Server
```

The system analyzes the chronological chain to identify the most relevant originating infrastructure.

It can then enrich the IP with:

```text
🌍 Geolocation
🏢 ISP
☁️ Hosting Provider
🔐 VPN / Proxy indicators
📡 Network information
```

---

# 🔗 Threat Intelligence

CertiMail integrates multiple intelligence sources.

| Source       | Purpose                         |
| ------------ | ------------------------------- |
| 🌍 IP-API    | IP geolocation                  |
| 🚨 AbuseIPDB | IP reputation                   |
| 🌐 DNS       | MX / infrastructure information |
| 🔎 WHOIS     | Domain registration information |

---

# 🧬 Cross-Case Correlation

One suspicious email may be part of a larger campaign.

CertiMail compares investigations using indicators such as:

```text
IP Address
     │
     ├── Case #001
     ├── Case #014
     ├── Case #027
     └── Case #031
```

Other correlation indicators include:

* 🌐 Shared domains
* 🌍 Shared IP addresses
* 🏢 Shared ISP
* 🧬 Infrastructure overlap
* 📧 Related sender information

---

# 🕸️ Threat Relationship Graph

The dashboard provides an interactive relationship graph.

```text
             🌐 Domain
              /    \
             /      \
          📧 Email  🌍 IP
             \      /
              \    /
              🏢 ISP
                │
             📁 Cases
```

This allows analysts to visually explore relationships between investigations.

---

# 📊 Interactive Investigation Dashboard

The dashboard provides:

### 🔍 Investigation

Submit raw email content and start forensic analysis.

### 🗂️ Case Management

Search, filter, paginate and reopen previous investigations.

### 🕸️ Threat Graph

Explore relationships between cases, domains, IPs and infrastructure.

### 📜 Audit Logs

Track investigation activity and chain-of-custody information.

### 📄 Report Export

Generate analyst-ready forensic reports in PDF format.

### 🚨 Real-Time Alerts

Optional browser and webhook-based notifications.

---

# 🔐 Privacy & Compliance

CertiMail includes several privacy-focused mechanisms.

### 👤 PII Masking

Sensitive information can optionally be masked before persistence.

### 🔒 Chain of Custody

Investigation activity is recorded through an audit logging system.

### 🗑️ Data Retention

MongoDB TTL indexes can automatically remove old investigation records.

```env
RETENTION_DAYS=90
```

---

# 🛠️ Tech Stack

### 🎨 Frontend

```text
React
Vite
Tailwind CSS
Axios
React Leaflet
React Force Graph
jsPDF
Lucide React
```

### ⚙️ Backend

```text
Node.js
Express 5
Mongoose
Express Rate Limit
CORS
```

### 🤖 AI / Forensics

```text
Python
FastAPI
Scikit-learn
TF-IDF
Logistic Regression
dnspython
python-whois
Pydantic
```

### 🗄️ Database

```text
MongoDB Atlas
```

### ☁️ Deployment

```text
Vercel
Render
MongoDB Atlas
```

---

# 📁 Project Structure

```text
certi-mail-forensic/
│
├── 🤖 ai_service/
│   ├── app.py
│   ├── classifier.py
│   └── requirements.txt
│
├── 🖥️ client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MatrixRain.jsx
│   │   │   ├── ThreatGraph.jsx
│   │   │   ├── RelatedCases.jsx
│   │   │   ├── CaseManager.jsx
│   │   │   ├── AuditLogViewer.jsx
│   │   │   └── ExportReport.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── ⚙️ server/
    ├── models/
    │   ├── Investigation.js
    │   └── AuditLog.js
    │
    ├── routes/
    │   ├── investigate.js
    │   └── threatIntel.js
    │
    ├── utils/
    │   ├── correlation.js
    │   ├── masking.js
    │   ├── alerting.js
    │   └── retention.js
    │
    ├── server.js
    └── package.json
```

---

# 🚀 Local Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/certi-mail-forensic.git

cd certi-mail-forensic
```

---

## 2️⃣ Start AI Service

```bash
cd ai_service

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
ALLOWED_ORIGIN=http://localhost:5173
INTERNAL_API_SECRET=<generate-a-long-random-secret>
```

Start service:

```bash
python app.py
```

---

## 3️⃣ Start Backend

```bash
cd ../server

npm install
```

Create:

```text
server/.env
```

Add:

```env
PORT=10000
PYTHON_AI_URL=http://localhost:8000

MONGODB_URI=<your-mongodb-connection-string>

CORS_ORIGIN=http://localhost:5173

INTERNAL_API_SECRET=<same-secret-used-by-ai-service>

ABUSEIPDB_KEY=<your-abuseipdb-api-key>

RETENTION_DAYS=90

ALERT_WEBHOOK_URL=<optional-slack-or-discord-webhook>
```

Run:

```bash
node server.js
```

---

## 4️⃣ Start Frontend

```bash
cd ../client

npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:10000
```

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

| Variable              | Service      | Purpose                 |
| --------------------- | ------------ | ----------------------- |
| `MONGODB_URI`         | Backend      | MongoDB connection      |
| `PYTHON_AI_URL`       | Backend      | AI service URL          |
| `CORS_ORIGIN`         | Backend      | Allowed frontend origin |
| `INTERNAL_API_SECRET` | Backend + AI | Service authentication  |
| `ABUSEIPDB_KEY`       | Backend      | IP reputation API       |
| `RETENTION_DAYS`      | Backend      | Investigation retention |
| `ALERT_WEBHOOK_URL`   | Backend      | Optional webhook        |
| `ALLOWED_ORIGIN`      | AI           | CORS configuration      |
| `VITE_API_URL`        | Frontend     | Backend API URL         |

> ⚠️ Never commit `.env` files or API keys to GitHub.

---

# 🔌 API Reference

| Method    | Endpoint                     | Description               |
| --------- | ---------------------------- | ------------------------- |
| 📤 `POST` | `/api/investigate`           | Analyze raw email         |
| 📥 `GET`  | `/api/history`               | Get recent investigations |
| 🔎 `GET`  | `/api/cases`                 | Search/filter cases       |
| 📂 `GET`  | `/api/cases/:id`             | Reopen investigation      |
| 🕸️ `GET` | `/api/correlation-graph/:id` | Get graph data            |
| 📜 `GET`  | `/api/audit-log`             | Get audit records         |
| 🌍 `GET`  | `/api/intel/lookup-ip/:ip`   | IP intelligence           |
| 🤖 `POST` | `/analyze`                   | AI forensic analysis      |

---

# 🧪 Investigation Flow

```text
📧 Email Submitted
        ↓
🔍 Parse Headers
        ↓
🤖 ML Classification
        ↓
🔗 URL Analysis
        ↓
📎 Attachment Analysis
        ↓
🔐 SPF / DKIM / DMARC
        ↓
📡 Received Chain Analysis
        ↓
🌍 Origin IP Extraction
        ↓
🗺️ Geolocation
        ↓
🔎 WHOIS / DNS
        ↓
🚨 Reputation Check
        ↓
🧬 Case Correlation
        ↓
🕸️ Threat Graph
        ↓
📄 Forensic Report
```

---

# 📸 Screenshots

Add your dashboard screenshots here:

```markdown
![Dashboard](./screenshots/dashboard.png)

![Investigation](./screenshots/investigation.png)

![Threat Graph](./screenshots/threat-graph.png)

![Case Management](./screenshots/cases.png)

![Audit Logs](./screenshots/audit-logs.png)
```

### Recommended Screenshot Set

| Screenshot       | What it demonstrates   |
| ---------------- | ---------------------- |
| 🖥️ Dashboard    | Overall UI             |
| 🔍 Investigation | Email threat analysis  |
| 🌍 Geolocation   | Origin IP intelligence |
| 🕸️ Threat Graph | Case correlation       |
| 📜 Audit Log     | Chain of custody       |
| 📄 PDF Report    | Forensic reporting     |

---

# ⚠️ Known Limitations

> **CertiMail Forensics is currently a hackathon prototype rather than a production-hardened security platform.**

### ☁️ Hosting

Render free-tier services can sleep after inactivity.

### 🤖 ML Dataset

The classifier currently uses a relatively small seed dataset.

### 👤 Authentication

There are no individual analyst accounts. Rate limiting provides basic request protection.

### 🔐 DKIM

DKIM analysis is currently header-based rather than complete cryptographic signature verification.

### 📎 Attachments

Attachment screening primarily examines filenames and extensions rather than performing deep malware analysis.

### 🚨 Alerts

Alerts currently trigger during investigation rather than through continuous inbox monitoring.

---

# 🔮 Future Improvements

```text
🔐 Analyst Authentication
        ↓
🧠 Larger ML Training Dataset
        ↓
🧬 Advanced Campaign Clustering
        ↓
🔬 Deep Attachment Analysis
        ↓
🔑 Full DKIM Cryptographic Verification
        ↓
📥 Continuous Mailbox Monitoring
        ↓
🛡️ SIEM Integration
        ↓
☁️ Production-Scale Infrastructure
```

Potential integrations include:

* SIEM platforms
* SOAR platforms
* Enterprise mail gateways
* Threat intelligence feeds
* Malware sandboxing
* YARA-based analysis
* STIX/TAXII feeds

---

# 🏆 Hackathon Information

|                          |                                           |
| ------------------------ | ----------------------------------------- |
| 🏆 **Event**             | Smart India Hackathon                     |
| 🆔 **Problem Statement** | 26106                                     |
| 🏢 **Organization**      | All India Council for Technical Education |
| 🛡️ **Department**       | Cyber Security Cell                       |
| 💻 **Category**          | Software                                  |
| 🔐 **Theme**             | Blockchain & Cybersecurity                |

---

# 👥 Team / Organization

**All India Council for Technical Education (AICTE)**
**Cyber Security Cell**

Built as a Smart India Hackathon project focused on AI-assisted email threat investigation and cybersecurity forensics.

---

# 📜 License

This project was developed for **Smart India Hackathon submission purposes**.

---

<p align="center">

### 🛡️ CertiMail Forensics

**Detect • Trace • Correlate • Investigate**

</p>
