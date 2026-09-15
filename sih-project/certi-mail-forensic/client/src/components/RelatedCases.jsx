import React from 'react';
import { Link2, Layers } from 'lucide-react';

export default function RelatedCases({ clusterId, relatedCases, onOpenCase }) {
  if (!relatedCases || relatedCases.length === 0) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-900/60 p-5 rounded-xl hover:shadow-glow-cyan transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
          <Link2 size={14} /> Cross-Case Correlation
        </h4>
        {clusterId && (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded flex items-center gap-1">
            <Layers size={10} /> {clusterId}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Found {relatedCases.length} prior case{relatedCases.length !== 1 ? 's' : ''} sharing infrastructure with this email.
      </p>

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
    </div>
  );
}