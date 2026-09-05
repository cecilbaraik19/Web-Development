import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Server, MapPin, CheckCircle, XCircle, Search, History } from 'lucide-react';
import ThreatGraph from './components/ThreatGraph';
import ExportReport from './components/ExportReport';

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [caseId, setCaseId] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
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
      const response = await axios.post('http://localhost:5000/api/investigate', {
        emailContent: emailText
      });
      setReport(response.data.report);
      setCaseId(response.data.caseId);
      fetchHistory();
    } catch (err) {
      alert('Error connecting to backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-slate-950 text-slate-100">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
            <ShieldAlert /> CertiMail Forensics
          </h1>
          <p className="text-xs text-slate-400 mt-1">Unified Email Threat & Infrastructure Analyzer</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-300">Raw Email / Header Input</h2>
            <textarea
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
              placeholder="Paste raw email header or text body here..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing Infrastructure...' : <><Search size={16} /> Run Forensic AI Analysis</>}
            </button>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-2 mb-3">
              <History size={14} /> Recent Investigations
            </h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {history.map((item) => (
                <div key={item._id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-xs">
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
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          {report ? (
            <>
              <div className="flex justify-end">
                <ExportReport reportData={report} caseId={caseId} />
              </div>

              <div className={`p-5 rounded-xl border flex justify-between items-center ${
                report.verdict === 'MALICIOUS' 
                  ? 'bg-red-950/40 border-red-800 text-red-300' 
                  : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              }`}>
                <div>
                  <span className="text-xs uppercase font-semibold">Overall Verdict</span>
                  <h3 className="text-2xl font-black">{report.verdict}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs">Risk Score</span>
                  <div className="text-3xl font-extrabold">{report.risk_score}/100</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {Object.entries(report.authentication).map(([key, value]) => (
                  <div key={key} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
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

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs text-slate-400 flex items-center gap-1 mb-2"><Server size={14}/> Extracted IP & Domains</h4>
                  <p className="font-mono text-cyan-400 text-sm">{report.extracted_ip}</p>
                  <div className="mt-2 text-xs text-slate-400">
                    Domains: {report.extracted_domains ? report.extracted_domains.join(', ') : 'None'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 flex items-center gap-1 mb-2"><MapPin size={14}/> Observed Location</h4>
                  <p className="text-sm font-medium">{report.estimated_geo.city}, {report.estimated_geo.country}</p>
                  <span className="text-xs text-slate-500">{report.estimated_geo.isp}</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="text-xs text-slate-400 mb-2">Detected AI / Language Risk Indicators</h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {report.nlp_indicators.map((indicator, idx) => (
                    <li key={idx}>{indicator}</li>
                  ))}
                </ul>
              </div>

              <ThreatGraph graphData={report.graph_relationships} />
            </>
          ) : (
            <div className="h-full bg-slate-900/50 border border-slate-800 border-dashed rounded-xl flex items-center justify-center text-slate-500 text-sm">
              Paste email contents and click Run Analysis to populate results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}