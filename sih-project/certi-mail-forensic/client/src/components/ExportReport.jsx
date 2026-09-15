import React from 'react';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

export default function ExportReport({ reportData, caseId, clusterId, relatedCases }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 40;

    const checkPageBreak = (neededSpace = 20) => {
      if (y + neededSpace > pageHeight - 15) {
        doc.addPage();
        y = 20;
      }
    };

    const sectionHeader = (title) => {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(title, 14, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    };

    const line = (text) => {
      checkPageBreak(7);
      doc.text(text, 14, y);
      y += 6;
    };

    // Header banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("CertiMail AI Forensic Investigation Report", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Case ID: ${caseId || 'N/A'}   |   Generated: ${new Date().toLocaleString()}`, 14, 25);
    doc.setTextColor(15, 23, 42);

    // Overview
    sectionHeader("INVESTIGATION OVERVIEW");
    line(`Verdict: ${reportData.verdict}`);
    line(`Risk Score: ${reportData.risk_score} / 100`);
    line(`Confidence: ${reportData.confidence ?? 'N/A'}%`);
    line(`Campaign Tag: ${reportData.campaign_tag || 'N/A'}`);
    if (clusterId) line(`Correlation Cluster: ${clusterId}`);
    y += 6;

    // ML Classification
    if (reportData.ml_classification) {
      sectionHeader("ML CLASSIFIER OUTPUT");
      line(`Predicted Label: ${reportData.ml_classification.label?.toUpperCase()}`);
      const probs = reportData.ml_classification.probabilities || {};
      line(`Probabilities: ${Object.entries(probs).map(([k, v]) => `${k}: ${v}%`).join('  |  ')}`);
      y += 6;
    }

    // Authentication
    sectionHeader("AUTHENTICATION RESULTS");
    line(`SPF: ${reportData.authentication?.spf || 'N/A'}    DKIM: ${reportData.authentication?.dkim || 'N/A'}    DMARC: ${reportData.authentication?.dmarc || 'N/A'}`);
    y += 6;

    // Header alignment
    if (reportData.header_alignment_issues) {
      sectionHeader("HEADER ALIGNMENT CHECK");
      reportData.header_alignment_issues.forEach((issue) => line(`- ${issue}`));
      y += 6;
    }

    // Infrastructure & Location
    sectionHeader("OBSERVED INFRASTRUCTURE & LOCATION");
    line(`IP Address: ${reportData.extracted_ip || 'N/A'}`);
    line(`Location: ${reportData.estimated_geo?.city || 'Unknown'}, ${reportData.estimated_geo?.country || 'Unknown'}`);
    line(`ISP / ASN: ${reportData.estimated_geo?.isp || 'Unknown'}`);
    if (reportData.infrastructure_masking?.is_likely_masked) {
      line(`VPN/Hosting Masking Detected: ${reportData.infrastructure_masking.matched_signature}`);
    }
    y += 6;

    // Threat Intelligence
    if (reportData.threat_intel) {
      sectionHeader("IP REPUTATION (ABUSEIPDB)");
      if (reportData.threat_intel.available) {
        line(`Reputation Score: ${reportData.threat_intel.reputationScore}/100`);
        line(`Total Abuse Reports: ${reportData.threat_intel.totalReports}`);
        line(`TOR Exit Node: ${reportData.threat_intel.isTorExitNode ? 'Yes' : 'No'}`);
      } else {
        line(`Reputation data unavailable: ${reportData.threat_intel.reason}`);
      }
      y += 6;
    }

    // WHOIS & DNS
    sectionHeader("WHOIS & REGISTRAR INTELLIGENCE");
    line(`Registrar: ${reportData.whois_data?.registrar || 'N/A'}`);
    line(`Creation Date: ${reportData.whois_data?.creation_date || 'N/A'}`);
    line(`MX Records: ${reportData.mx_records ? reportData.mx_records.join(', ') : 'N/A'}`);
    line(`DNSSEC Status: ${reportData.whois_data?.dnssec || 'N/A'}`);
    y += 6;

    // Risk Indicators
    sectionHeader("AI / LANGUAGE RISK INDICATORS");
    if (reportData.nlp_indicators?.length > 0) {
      reportData.nlp_indicators.forEach((indicator) => line(`- ${indicator}`));
    } else {
      line("- No explicit social engineering indicators found");
    }
    y += 6;

    // Related Cases / Correlation
    if (relatedCases && relatedCases.length > 0) {
      sectionHeader("CROSS-CASE CORRELATION");
      line(`${relatedCases.length} related case(s) found sharing infrastructure indicators.`);
      relatedCases.slice(0, 8).forEach((c) => {
        line(`- ${c.extractedIp || 'N/A'} | ${c.verdict} | ${new Date(c.createdAt).toLocaleDateString()} | ${(c.matchReasons || []).join(', ')}`);
      });
      y += 6;
    }

    // Footer note
    checkPageBreak(15);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("This report was generated automatically for forensic review purposes. Verify findings before acting on them.", 14, pageHeight - 10);

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