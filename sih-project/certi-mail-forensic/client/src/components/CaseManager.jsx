import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Folder, X } from 'lucide-react';

export default function CaseManager({ onOpenCase }) {
  const [query, setQuery] = useState('');
  const [verdict, setVerdict] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [cases, setCases] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://certimail-forensic.onrender.com';
  const CLIENT_KEY = import.meta.env.VITE_CLIENT_KEY;

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (query) params.query = query;
      if (verdict !== 'ALL') params.verdict = verdict;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await axios.get(`${BACKEND_URL}/api/cases`, {
        params,
        headers: { 'x-client-key': CLIENT_KEY }
      });
      setCases(res.data.cases);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to search cases');
    } finally {
      setLoading(false);
    }
  }, [query, verdict, dateFrom, dateTo, page]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchCases(), 350);
    return () => clearTimeout(debounce);
  }, [fetchCases]);

  const handleOpenCase = async (caseId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/cases/${caseId}`, {
        headers: { 'x-client-key': CLIENT_KEY }
      });
      onOpenCase(res.data.report, res.data.caseId);
    } catch (err) {
      alert('Failed to open case');
    }
  };

  const clearFilters = () => {
    setQuery(''); setVerdict('ALL'); setDateFrom(''); setDateTo(''); setPage(1);
  };

  const hasFilters = query || verdict !== 'ALL' || dateFrom || dateTo;

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm p-5 rounded-xl border border-slate-800 hover:border-cyan-800 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Folder size={14} /> Case Management
        </h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1">
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by IP, domain, or campaign tag..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={verdict}
            onChange={(e) => { setVerdict(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All verdicts</option>
            <option value="MALICIOUS">Malicious</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="LEGITIMATE">Legitimate</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 min-h-[80px]">
        {loading ? (
          <div className="text-xs text-slate-500 text-center py-6">Searching...</div>
        ) : cases.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-6">No cases match these filters.</div>
        ) : (
          cases.map((item) => (
            <button
              key={item._id}
              onClick={() => handleOpenCase(item._id)}
              className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-xs hover:border-cyan-800/60 transition-colors text-left"
            >
              <div>
                <span className="font-mono text-cyan-400">{item.extractedIp || 'N/A'}</span>
                <span className="text-slate-500 block text-[10px]">
                  {new Date(item.createdAt).toLocaleString()} · {item.campaignTag || 'uncategorized'}
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
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>{total} case{total !== 1 ? 's' : ''} total</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span>{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}