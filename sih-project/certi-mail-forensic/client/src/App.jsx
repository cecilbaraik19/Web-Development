import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ShieldAlert, Server, MapPin, CheckCircle, XCircle, Search, History, Globe, Layers, AlertTriangle, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ThreatGraph from './components/ThreatGraph';
import ExportReport from './components/ExportReport';
import MatrixRain from './components/MatrixRain';
import CaseManager from './components/CaseManager';
import RelatedCases from './components/RelatedCases';
import AuditLogViewer from './components/AuditLogViewer';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SCAN_SEQUENCE = [
  '> parsing MIME structure...',
  '> walking Received: header chain...',
  '> resolving origin IP geolocation...',
  '> querying WHOIS + DNS/MX records...',
  '> running ML phishing classifier...',
  '> checking SPF / DKIM / DMARC alignment...',
  '> scanning for typosquatting and obfuscated URLs...',
  '> analyzing attachments...',
  '> cross-referencing threat intelligence...',
  '> correlating with case history...',
  '> compiling forensic report...',
];

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const [report, setReport] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [clusterId, setClusterId] = useState(null);
  const [relatedCases, setRelatedCases] = useState([]);
  const [history, setHistory] = useState([]);
  const [maskBeforeStorage, setMaskBeforeStorage] = useState(true);
  const intervalRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';

  const animatedRisk = useCountUp(report?.risk_score);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (loading) {
      setScanLine(0);
      intervalRef.current = setInterval(() => {
        setScanLine((prev) => (prev + 1) % SCAN_SEQUENCE.length);
      }, 450);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!emailText) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/investigate`, {
        emailContent: emailText,
        maskBeforeStorage
      }, { timeout: 60000 });
      setReport(response.data.report);
      setCaseId(response.data.caseId);
      setClusterId(response.data.clusterId);
      setRelatedCases(response.data.relatedCases || []);

      if (response.data.report.verdict === 'MALICIOUS' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('🚨 High-Risk Email Detected', {
            body: `Risk Score: ${response.data.report.risk_score}/100 · IP: ${response.data.report.extracted_ip}`,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }

      fetchHistory();
    } catch (err) {
      alert('Error connecting to backend server or Python service timeout.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmailText('');
    setReport(null);
    setCaseId(null);
    setClusterId(null);
    setRelatedCases([]);
  };

  const handleOpenCase = async (id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/cases/${id}`);
      setReport(res.data.report);
      setCaseId(res.data.caseId);
      setClusterId(res.data.clusterId);
      setRelatedCases(res.data.relatedCases || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to open case');
    }
  };

  const verdictGlow = (v) =>
    v === 'MALICIOUS' ? 'shadow-glow-red' : v === 'SUSPICIOUS' ? 'shadow-glow-amber' : 'shadow-glow-emerald';

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 overflow-hidden">
      <MatrixRain boosted={loading} />
      <div className="scanline-overlay" />

      <div className="relative z-10 p-6 font-sans">
        <header className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
              <ShieldAlert className="drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]" />
              CertiMail Forensics
              <span className="text-cyan-400 animate-blink">_</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Unified AI Email Threat & Infrastructure Analyzer</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow shadow-glow-emerald"></span>
            SYSTEM ONLINE
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900/90 backdrop-blur-sm p-5 rounded-xl border border-slate-800 hover:border-cyan-800 hover:shadow-glow-cyan transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300">Raw Email / Header Input</h2>
                {emailText && (
                  <button
                    onClick={handleClear}
                    disabled={loading}
                    className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-xs disabled:opacity-40"
                    title="Clear input"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>
              <textarea
                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 focus:shadow-glow-cyan font-mono transition-all"
                placeholder="Paste raw email header or text body here..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maskBeforeStorage}
                  onChange={(e) => setMaskBeforeStorage(e.target.checked)}
                  className="accent-cyan-500"
                />
                Mask sensitive data (emails, numbers) before storing this case
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !emailText}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 hover:shadow-glow-cyan py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="font-mono text-xs">{SCAN_SEQUENCE[scanLine]}</span>
                  ) : (
                    <><Search size={16} /> Run AI Forensic Analysis</>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading || (!emailText && !report)}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-sm p-5 rounded-xl border border-slate-800 hover:border-cyan-800 transition-all duration-300">
              <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-2 mb-3">
                <History size={14} /> Recent Investigations
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item._id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-xs hover:border-cyan-800/60 transition-colors">
                    <div>
                      <span className="font-mono text-cyan-400">{item.extractedIp || 'N/A'}</span>
                      <span className="text-slate-500 block text-[10px]">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.verdict === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {item.verdict}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <CaseManager onOpenCase={(reportData, id) => handleOpenCase(id)} />

            <AuditLogViewer />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {report ? (
              <>
                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:shadow-glow-cyan transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-950/60 border border-cyan-800 rounded-lg text-cyan-400">
                      <Layers size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 tracking-wider">Active Attack Campaign Cluster</span>
                      <h4 className="text-sm font-mono font-bold text-slate-200">{report.campaign_tag || 'CLEAN-TRANSMISSION-BASELINE'}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span className="text-slate-300 font-medium">
                      {relatedCases.length > 0 ? `${relatedCases.length} Linked Case(s)` : 'No Prior Links'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ExportReport reportData={report} caseId={caseId} clusterId={clusterId} relatedCases={relatedCases} />
                </div>

                <div className={`p-5 rounded-xl border flex justify-between items-center animate-pulse-glow ${verdictGlow(report.verdict)} ${
                  report.verdict === 'MALICIOUS' 
                    ? 'bg-red-950/40 border-red-800 text-red-300' 
                    : report.verdict === 'SUSPICIOUS'
                    ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                }`}>
                  <div>
                    <span className="text-xs uppercase font-semibold">Overall Verdict</span>
                    <h3 className="text-2xl font-black">{report.verdict}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs">Risk Score</span>
                    <div className="text-3xl font-extrabold font-mono">{animatedRisk}/100</div>
                  </div>
                </div>

                <RelatedCases clusterId={clusterId} relatedCases={relatedCases} onOpenCase={handleOpenCase} caseId={caseId} />

                {report.ml_classification && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl hover:border-cyan-800 transition-all">
                    <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">ML Classifier Output</h4>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-mono text-cyan-400 uppercase">{report.ml_classification.label}</span>
                      <div className="flex gap-3 text-xs text-slate-400">
                        {Object.entries(report.ml_classification.probabilities || {}).map(([label, pct]) => (
                          <span key={label}>{label}: {pct}%</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {report.threat_intel && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl hover:border-cyan-800 transition-all">
                    <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">IP Reputation (AbuseIPDB)</h4>
                    {report.threat_intel.available ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-2xl font-black ${
                            report.threat_intel.reputationScore >= 50 ? 'text-red-400' : 'text-emerald-400'
                          }`}>
                            {report.threat_intel.reputationScore}/100
                          </span>
                          <p className="text-xs text-slate-400 mt-1">{report.threat_intel.totalReports} abuse reports on file</p>
                        </div>
                        {report.threat_intel.isTorExitNode && (
                          <span className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-1 rounded">
                            TOR EXIT NODE
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Reputation data unavailable: {report.threat_intel.reason}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(report.authentication).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-4 rounded-xl text-center hover:shadow-glow-cyan transition-all">
                      <span className="text-xs uppercase text-slate-400">{key}</span>
                      <div className="flex items-center justify-center gap-1 mt-1 font-bold text-sm">
                        {value === 'PASS' || value === 'VERIFIED' || value === 'ALIGNED' ? (
                          <CheckCircle size={16} className="text-emerald-400" />
                        ) : (
                          <XCircle size={16} className="text-red-400" />
                        )}
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {report.header_alignment_issues && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Header Alignment Check</h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {report.header_alignment_issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.typosquatting_findings?.length > 0 && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-red-900/60 p-5 rounded-xl">
                    <h4 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider">Typosquatting / Brand Impersonation</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {report.typosquatting_findings.map((f, idx) => (
                        <li key={idx}>
                          Impersonates <span className="text-red-400 font-mono">{f.impersonated_brand}</span>
                          {f.similarity_score && ` (${f.similarity_score}% similar)`}
                          {f.note && ` — ${f.note}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.obfuscated_url_findings?.length > 0 && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-amber-900/60 p-5 rounded-xl">
                    <h4 className="text-xs font-semibold text-amber-400 mb-3 uppercase tracking-wider">Obfuscated URLs Detected</h4>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {report.obfuscated_url_findings.map((f, idx) => (
                        <li key={idx}>
                          <span className="font-mono text-cyan-400 break-all">{f.url}</span>
                          <ul className="list-disc list-inside text-slate-400 ml-2 mt-0.5">
                            {f.reasons.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.attachment_findings?.length > 0 && (
                  <div className="bg-slate-900/90 backdrop-blur-sm border border-red-900/60 p-5 rounded-xl">
                    <h4 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider">Attachment Analysis</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {report.attachment_findings.map((f, idx) => (
                        <li key={idx}>
                          <span className="font-mono text-cyan-400">{f.filename}</span> — {f.reasons.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl flex flex-col justify-between hover:border-cyan-800 transition-all">
                  <div>
                    <h4 className="text-xs text-slate-400 flex items-center gap-1 mb-2"><Server size={14}/> Extracted IP & Domains</h4>
                    <p className="font-mono text-cyan-400 text-sm">{report.extracted_ip}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      Domains: {report.extracted_domains ? report.extracted_domains.join(', ') : 'None'}
                    </div>
                    {report.infrastructure_masking?.is_likely_masked && (
                      <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                        <AlertTriangle size={12} /> Likely VPN/Hosting infrastructure detected ({report.infrastructure_masking.matched_signature})
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs text-slate-400 flex items-center gap-1 mb-1"><MapPin size={14}/> Observed Location</h4>
                      <p className="text-sm font-medium">{report.estimated_geo.city}, {report.estimated_geo.country}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{report.estimated_geo.isp}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">WHOIS & Registrar Intelligence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Registrar</span>
                      <span className="font-medium text-slate-300 truncate block">{report.whois_data?.registrar || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Creation Date</span>
                      <span className="font-medium text-slate-300">{report.whois_data?.creation_date || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">MX Records</span>
                      <span className="font-medium text-cyan-400 truncate block">
                        {report.mx_records ? report.mx_records.join(', ') : 'N/A'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">DNSSEC Status</span>
                      <span className="font-medium text-emerald-400">{report.whois_data?.dnssec || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-5 rounded-xl">
                  <h4 className="text-xs text-slate-400 mb-2">Detected Language Risk Indicators</h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {report.nlp_indicators.map((indicator, idx) => (
                      <li key={idx}>{indicator}</li>
                    ))}
                  </ul>
                </div>

                <ThreatGraph graphData={report.graph_relationships} />

                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 p-4 rounded-xl overflow-hidden h-[500px] flex flex-col">
                  <h4 className="text-xs text-slate-400 flex items-center gap-1 mb-3"><Globe size={14}/> Interactive Transmission Map</h4>
                  <div className="flex-1 w-full rounded-lg overflow-hidden border border-slate-800">
                    <MapContainer 
                      center={[report.estimated_geo.lat || 20.5937, report.estimated_geo.lon || 78.9629]} 
                      zoom={4} 
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[report.estimated_geo.lat || 20.5937, report.estimated_geo.lon || 78.9629]}>
                        <Popup>
                          Origin Node: {report.extracted_ip}<br />
                          Location: {report.estimated_geo.city}, {report.estimated_geo.country}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full bg-slate-900/50 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-slate-500 text-sm p-12">
                Paste email headers and click Run Analysis to populate results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}