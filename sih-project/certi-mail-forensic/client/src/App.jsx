import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Server, MapPin, CheckCircle, XCircle, Search, History, Globe, Layers, AlertTriangle, Terminal } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ThreatGraph from './components/ThreatGraph';
import ExportReport from './components/ExportReport';
import MatrixRain from './components/MatrixRain';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Panel = ({ children, className = '' }) => (
  <div className={`bg-matrix-panel border border-matrix-border rounded-none p-5 ${className}`}>
    {children}
  </div>
);

const PanelTitle = ({ children }) => (
  <h4 className="text-xs text-matrix-green-dim mb-3 tracking-wide">&gt; {children}</h4>
);

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [history, setHistory] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/history`, {
        headers: { 'x-client-key': CLIENT_KEY }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!emailText) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/investigate`, {
        emailContent: emailText
      }, {
        timeout: 60000,
        headers: { 'x-client-key': CLIENT_KEY }
      });
      setReport(response.data.report);
      setCaseId(response.data.caseId);
      fetchHistory();
    } catch (err) {
      alert('Error connecting to backend server or Python service timeout.');
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = (v) =>
    v === 'MALICIOUS' ? 'text-matrix-danger border-matrix-danger shadow-glow-red'
    : v === 'SUSPICIOUS' ? 'text-matrix-warning border-matrix-warning shadow-glow-amber'
    : 'text-matrix-green border-matrix-green shadow-glow-green';

  return (
    <div className="min-h-screen relative bg-matrix-bg text-matrix-green font-mono">
      <MatrixRain />
      <div className="scanline-overlay" />

      <div className="relative z-10 p-6">
        <header className="flex justify-between items-center pb-6 border-b border-matrix-border animate-flicker">
          <div>
            <h1 className="text-3xl font-display flex items-center gap-2 text-matrix-green shadow-glow-green tracking-wider">
              <Terminal /> CERTIMAIL_FORENSICS
            </h1>
            <p className="text-xs text-matrix-green-dim mt-1">&gt; unified_email_threat_and_infrastructure_analyzer.exe</p>
          </div>
          <div className="text-xs text-matrix-green-dim hidden sm:block">
            [ SYSTEM_STATUS: <span className="text-matrix-green">ONLINE</span> ]
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Panel className="flex flex-col gap-4">
              <PanelTitle>raw_email_header_input</PanelTitle>
              <textarea
                className="w-full h-64 bg-black border border-matrix-border p-3 text-xs text-matrix-green focus:outline-none focus:border-matrix-green focus:shadow-glow-green font-mono resize-none"
                placeholder="// paste raw email header or text body here..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-black border border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black py-2.5 font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? '> ANALYZING_INFRASTRUCTURE...' : <><Search size={16} /> RUN_FORENSIC_ANALYSIS</>}
              </button>
            </Panel>

            <Panel>
              <h3 className="text-xs text-matrix-green-dim flex items-center gap-2 mb-3">
                <History size={14} /> &gt; recent_investigations.log
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item._id} className="p-2.5 bg-black border border-matrix-border flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-matrix-green">{item.extractedIp || 'N/A'}</span>
                      <span className="text-matrix-green-dim block text-[10px]">{new Date(item.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 border font-bold text-[10px] ${
                      item.verdict === 'MALICIOUS' ? 'border-matrix-danger text-matrix-danger' : 'border-matrix-green text-matrix-green'
                    }`}>
                      {item.verdict}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {report ? (
              <>
                <Panel className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black border border-matrix-border text-matrix-green">
                      <Layers size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] text-matrix-green-dim tracking-wider">active_attack_campaign_cluster</span>
                      <h4 className="text-sm font-mono font-bold text-matrix-green">{report.campaign_tag || 'CLEAN-TRANSMISSION-BASELINE'}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-black px-3 py-1.5 border border-matrix-warning text-xs">
                    <AlertTriangle size={14} className="text-matrix-warning" />
                    <span className="text-matrix-warning font-medium">multi_vector_cluster_linked</span>
                  </div>
                </Panel>

                <div className="flex justify-end">
                  <ExportReport reportData={report} caseId={caseId} />
                </div>

                <div className={`p-5 border flex justify-between items-center bg-black ${verdictColor(report.verdict)}`}>
                  <div>
                    <span className="text-xs">overall_verdict</span>
                    <h3 className="text-4xl font-display tracking-wider">{report.verdict}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs">risk_score</span>
                    <div className="text-4xl font-display">{report.risk_score}/100</div>
                  </div>
                </div>

                {report.ml_classification && (
                  <Panel>
                    <PanelTitle>ml_classifier_output</PanelTitle>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-lg font-display text-matrix-green tracking-wide">{report.ml_classification.label.toUpperCase()}</span>
                      <div className="flex gap-3 text-xs text-matrix-green-dim">
                        {Object.entries(report.ml_classification.probabilities || {}).map(([label, pct]) => (
                          <span key={label}>{label}: {pct}%</span>
                        ))}
                      </div>
                    </div>
                  </Panel>
                )}

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(report.authentication).map(([key, value]) => (
                    <div key={key} className="bg-matrix-panel border border-matrix-border p-4 text-center">
                      <span className="text-xs text-matrix-green-dim">{key}</span>
                      <div className={`flex items-center justify-center gap-1 mt-1 font-bold text-sm ${
                        value === 'PASS' ? 'text-matrix-green' : 'text-matrix-danger'
                      }`}>
                        {value === 'PASS' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {report.header_alignment_issues && (
                  <Panel>
                    <PanelTitle>header_alignment_check</PanelTitle>
                    <ul className="list-none text-xs text-matrix-green-dim space-y-1">
                      {report.header_alignment_issues.map((issue, idx) => (
                        <li key={idx}>&gt; {issue}</li>
                      ))}
                    </ul>
                  </Panel>
                )}

                <Panel className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs text-matrix-green-dim flex items-center gap-1 mb-2"><Server size={14}/> extracted_ip_and_domains</h4>
                    <p className="font-mono text-matrix-green text-sm">{report.extracted_ip}</p>
                    <div className="mt-2 text-xs text-matrix-green-dim">
                      domains: {report.extracted_domains ? report.extracted_domains.join(', ') : 'none'}
                    </div>
                    {report.infrastructure_masking?.is_likely_masked && (
                      <div className="mt-2 text-xs text-matrix-warning flex items-center gap-1">
                        <AlertTriangle size={12} /> vpn/hosting infrastructure detected ({report.infrastructure_masking.matched_signature})
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-matrix-border flex justify-between items-center">
                    <div>
                      <h4 className="text-xs text-matrix-green-dim flex items-center gap-1 mb-1"><MapPin size={14}/> observed_location</h4>
                      <p className="text-sm font-medium text-matrix-green">{report.estimated_geo.city}, {report.estimated_geo.country}</p>
                    </div>
                    <span className="text-xs text-matrix-green-dim font-mono">{report.estimated_geo.isp}</span>
                  </div>
                </Panel>

                <Panel>
                  <PanelTitle>whois_and_registrar_intelligence</PanelTitle>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-black p-3 border border-matrix-border">
                      <span className="text-matrix-green-dim block text-[10px]">registrar</span>
                      <span className="font-medium text-matrix-green truncate block">{report.whois_data?.registrar || 'N/A'}</span>
                    </div>
                    <div className="bg-black p-3 border border-matrix-border">
                      <span className="text-matrix-green-dim block text-[10px]">creation_date</span>
                      <span className="font-medium text-matrix-green">{report.whois_data?.creation_date || 'N/A'}</span>
                    </div>
                    <div className="bg-black p-3 border border-matrix-border">
                      <span className="text-matrix-green-dim block text-[10px]">mx_records</span>
                      <span className="font-medium text-matrix-green truncate block">
                        {report.mx_records ? report.mx_records.join(', ') : 'N/A'}
                      </span>
                    </div>
                    <div className="bg-black p-3 border border-matrix-border">
                      <span className="text-matrix-green-dim block text-[10px]">dnssec_status</span>
                      <span className="font-medium text-matrix-green">{report.whois_data?.dnssec || 'Unknown'}</span>
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <PanelTitle>detected_language_risk_indicators</PanelTitle>
                  <ul className="list-none text-xs text-matrix-green-dim space-y-1">
                    {report.nlp_indicators.map((indicator, idx) => (
                      <li key={idx}>&gt; {indicator}</li>
                    ))}
                  </ul>
                </Panel>

                <ThreatGraph graphData={report.graph_relationships} />

                <Panel className="overflow-hidden h-[500px] flex flex-col">
                  <PanelTitle>interactive_transmission_map</PanelTitle>
                  <div className="flex-1 w-full border border-matrix-border overflow-hidden">
                    <MapContainer 
                      center={[report.estimated_geo.lat || 20.5937, report.estimated_geo.lon || 78.9629]} 
                      zoom={4} 
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%", filter: 'grayscale(1) invert(1) hue-rotate(90deg)' }}
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
                </Panel>
              </>
            ) : (
              <div className="h-full bg-matrix-panel border border-dashed border-matrix-border flex items-center justify-center text-matrix-green-dim text-sm p-12">
                &gt; awaiting_input :: paste email headers and run analysis to populate results_
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}