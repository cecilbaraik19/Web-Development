import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

export default function ExportReport({ reportData, caseId }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("CertiMail Forensic Investigation Report", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Case ID: ${caseId || 'N/A'}`, 14, 25);

    let y = 40;
    doc.setTextColor(15, 23, 42);

    // Overview Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVESTIGATION OVERVIEW", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Verdict: ${reportData.verdict}`, 14, y);
    doc.text(`Risk Score: ${reportData.risk_score} / 100`, 100, y);
    y += 6;
    doc.text(`Campaign Tag: ${reportData.campaign_tag || 'N/A'}`, 14, y);
    y += 12;

    // Authentication Results
    doc.setFont("helvetica", "bold");
    doc.text("AUTHENTICATION RESULTS", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`SPF: ${reportData.authentication?.spf || 'N/A'}`, 14, y);
    doc.text(`DKIM: ${reportData.authentication?.dkim || 'N/A'}`, 80, y);
    doc.text(`DMARC: ${reportData.authentication?.dmarc || 'N/A'}`, 140, y);
    y += 14;

    // Observed Infrastructure & Location
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVED INFRASTRUCTURE & LOCATION", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`IP Address: ${reportData.extracted_ip || 'N/A'}`, 14, y);
    y += 6;
    doc.text(`Location: ${reportData.estimated_geo?.city || 'Unknown'}, ${reportData.estimated_geo?.country || 'Unknown'}`, 14, y);
    y += 6;
    doc.text(`ISP / ASN: ${reportData.estimated_geo?.isp || 'Unknown'}`, 14, y);
    y += 14;

    // WHOIS & Registrar Intelligence
    doc.setFont("helvetica", "bold");
    doc.text("WHOIS & REGISTRAR INTELLIGENCE", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Registrar: ${reportData.whois_data?.registrar || 'N/A'}`, 14, y);
    y += 6;
    doc.text(`Creation Date: ${reportData.whois_data?.creation_date || 'N/A'}`, 14, y);
    y += 6;
    doc.text(`MX Records: ${reportData.whois_data?.mx_records || 'N/A'}`, 14, y);
    y += 6;
    doc.text(`DNSSEC Status: ${reportData.whois_data?.dnssec || 'N/A'}`, 14, y);
    y += 14;

    // AI Risk Indicators
    doc.setFont("helvetica", "bold");
    doc.text("AI RISK INDICATORS", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    
    if (reportData.nlp_indicators && reportData.nlp_indicators.length > 0) {
      reportData.nlp_indicators.forEach((indicator) => {
        doc.text(`- ${indicator}`, 14, y);
        y += 6;
      });
    } else {
      doc.text("- No explicit social engineering indicators found", 14, y);
      y += 6;
    }

    // Save PDF
    doc.save(`CertiMail_Forensic_Report_${caseId || 'export'}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition"
    >
      <Download size={14} /> Export Comprehensive PDF Report
    </button>
  );
}