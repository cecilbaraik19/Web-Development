import React, { useState } from 'react';
import axios from 'axios';
import { Link2, Layers, Network } from 'lucide-react';
import ThreatGraph from './ThreatGraph';

export default function RelatedCases({ clusterId, relatedCases, onOpenCase, caseId }) {
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [loadingGraph, setLoadingGraph] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';

  if (!relatedCases || relatedCases.length === 0) return null;

  const handleToggleGraph = async () => {
    if (!showGraph && !graphData && caseId) {
      setLoadingGraph(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/correlation-graph/${caseId}`);
        setGraphData(res.data.graph);
      } catch (err) {
        console.error('Failed to load correlation graph');
      } finally {
        setLoadingGraph(false);
      }
    }
    setShowGraph((s) => !s);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-900/60 p-5 rounded-xl hover:shadow-glow-cyan transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
          <Link2 size={14} /> Cross-Case Correlation
        </h4>
        <div className="flex items-center gap-2">
          {clusterId && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded flex items-center gap-1">
              <Layers size={10} /> {clusterId}
            </span>
          )}
          <button
            onClick={handleToggleGraph}
            disabled={loadingGraph}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
          >
            <Network size={10} /> {loadingGraph ? 'Loading...' : showGraph ? 'Show List' : 'Show Graph'}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Found {relatedCases.length} prior case{relatedCases.length !== 1 ? 's' : ''} sharing infrastructure with this email.
      </p>

      {showGraph && graphData ? (
        <ThreatGraph graphData={graphData} title="Cross-Case Infrastructure Graph" />
      ) : (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {relatedCases.map((item) => (
            <button
              key={item._id}
              onClick={() => onOpenCase(item._id)}
              className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-xs hover:border-cyan-800/60 transition-colors text-left w-full"
            >
              <div>
                <span className="font-mono text-cyan-400">{item.extractedIp || 'N/A'}</span>
                <span className="text-slate-500 block text-[10px]">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
                <span className="text-slate-500 text-[10px]">
                  {item.matchReasons?.join(' · ')}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ml-2 ${
                item.verdict === 'MALICIOUS' ? 'bg-red-950 text-red-400 border border-red-800'
                : item.verdict === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {item.verdict}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}