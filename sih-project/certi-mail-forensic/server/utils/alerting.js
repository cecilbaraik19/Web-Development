import axios from 'axios';

/**
 * Sends a real-time alert to a configured webhook (Slack, Discord, or any
 * generic webhook endpoint) when a high-risk verdict is reached.
 * This satisfies the "real-time alerts for high-risk emails before user
 * interaction or administrative approval" requirement — the alert fires
 * automatically at analysis time, not when someone happens to view the dashboard.
 */
export async function sendHighRiskAlert(caseData) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    return { sent: false, reason: 'ALERT_WEBHOOK_URL not configured' };
  }

  const { verdict, riskScore, extractedIp, campaignTag, caseId } = caseData;

  // Only alert on MALICIOUS by default — SUSPICIOUS is common enough that
  // alerting on it too would create noise and desensitize analysts.
  if (verdict !== 'MALICIOUS') {
    return { sent: false, reason: 'Verdict below alert threshold' };
  }

  const payload = {
    text: `🚨 HIGH-RISK EMAIL DETECTED\nVerdict: ${verdict}\nRisk Score: ${riskScore}/100\nOrigin IP: ${extractedIp || 'Unknown'}\nCampaign: ${campaignTag || 'N/A'}\nCase ID: ${caseId}`
  };

  try {
    await axios.post(webhookUrl, payload, { timeout: 5000 });
    return { sent: true };
  } catch (error) {
    console.log('--> Alert webhook failed:', error.message);
    return { sent: false, reason: 'Webhook delivery failed', detail: error.message };
  }
}