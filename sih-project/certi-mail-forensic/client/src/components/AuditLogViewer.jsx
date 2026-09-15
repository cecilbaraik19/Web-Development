import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/audit-log`, {
        headers: { 'x-client-key': CLIENT_KEY }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) fetchLogs();
  }, [expanded]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm p-5 rounded-xl border border-slate-800 hover:border-cyan-800 transition-all duration-300">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between text-xs font-semibold text-slate-400"
      >
        <span className="flex items-center gap-2">
          <ClipboardList size={14} /> Audit / Chain-of-Custody Log
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] text-slate-500">
              Immutable record of every analysis performed — who, when, and what verdict was reached.
            </p>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-xs text-slate-500 text-center py-6">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-6">No audit entries yet.</div>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] flex justify-between items-center">
                  <div>
                    <span className="text-slate-300 font-mono">{log.action}</span>
                    <span className="text-slate-500 block text-[10px]">
                      by {log.actor} · {new Date(log.timestamp).toLocaleString()}
                      {log.wasMasked && <span className="text-cyan-500"> · masked</span>}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ml-2 ${
                    log.verdict === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800'
                    : log.verdict === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {log.verdict}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}