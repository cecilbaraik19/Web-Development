import axios from 'axios';

/**
 * Sends a real-time alert to a configured webhook (Slack, Discord, or any
 * generic webhook endpoint) when a high-risk verdict is reached.
 */
export async function sendHighRiskAlert(caseData) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    return { sent: false, reason: 'ALERT_WEBHOOK_URL not configured' };
  }

  const { verdict, riskScore, extractedIp, campaignTag, caseId } = caseData;

  if (verdict !== 'MALICIOUS') {
    return { sent: false, reason: 'Verdict below alert threshold' };
  }

  const message = `🚨 HIGH-RISK EMAIL DETECTED\nVerdict: ${verdict}\nRisk Score: ${riskScore}/100\nOrigin IP: ${extractedIp || 'Unknown'}\nCampaign: ${campaignTag || 'N/A'}\nCase ID: ${caseId}`;

  // Discord webhooks require "content", Slack webhooks require "text".
  // Sending both keys together works on both platforms — each service
  // reads the field it recognizes and ignores the other.
  const payload = {
    content: message,
    text: message
  };

  try {
    await axios.post(webhookUrl, payload, { timeout: 5000 });
    return { sent: true };
  } catch (error) {
    console.log('--> Alert webhook failed:', error.message, error.response?.data);
    return { sent: false, reason: 'Webhook delivery failed', detail: error.message };
  }
}