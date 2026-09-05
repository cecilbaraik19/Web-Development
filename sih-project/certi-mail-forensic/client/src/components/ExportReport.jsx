import React from 'react';
import html2pdf from 'html2pdf.js';
import { Download } from 'lucide-react';

export default function ExportReport({ reportData, caseId }) {
  const handleDownloadPDF = () => {
    const element = document.getElementById('forensic-report-export');
    const opt = {
      margin:       0.5,
      filename:     `CertiMail_Forensic_Report_${caseId || 'Export'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      <button
        onClick={handleDownloadPDF}
        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition"
      >
        <Download size={14} /> Export Forensic Report (PDF)
      </button>

      <div className="hidden">
        <div id="forensic-report-export" className="p-8 bg-white text-slate-900 font-sans">
          <h1 className="text-2xl font-bold border-b pb-2 mb-4 text-slate-900">
            CertiMail Forensic Investigation Report
          </h1>
          <p className="text-sm text-slate-600 mb-6">Case ID: {caseId || 'N/A'}</p>

          <div className="mb-6 p-4 rounded bg-slate-100 border">
            <h2 className="text-lg font-bold">Verdict: {reportData?.verdict}</h2>
            <p className="text-sm">Risk Score: {reportData?.risk_score}/100</p>
          </div>

          <h3 className="font-bold border-b mb-2 text-sm uppercase">Authentication Results</h3>
          <ul className="text-sm mb-6 space-y-1">
            <li><strong>SPF:</strong> {reportData?.authentication?.spf}</li>
            <li><strong>DKIM:</strong> {reportData?.authentication?.dkim}</li>
            <li><strong>DMARC:</strong> {reportData?.authentication?.dmarc}</li>
          </ul>

          <h3 className="font-bold border-b mb-2 text-sm uppercase">Observed Infrastructure</h3>
          <p className="text-sm mb-1"><strong>IP Address:</strong> {reportData?.extracted_ip}</p>
          <p className="text-sm mb-6"><strong>Location:</strong> {reportData?.estimated_geo?.city}, {reportData?.estimated_geo?.country} ({reportData?.estimated_geo?.isp})</p>

          <h3 className="font-bold border-b mb-2 text-sm uppercase">AI Risk Indicators</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {reportData?.nlp_indicators?.map((ind, i) => (
              <li key={i}>{ind}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}