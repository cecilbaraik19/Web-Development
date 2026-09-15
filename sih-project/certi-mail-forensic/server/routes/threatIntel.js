import express from 'express';
import axios from 'axios';

const router = express.Router();

export async function checkIpReputation(ip) {
  const abuseKey = process.env.ABUSEIPDB_KEY;

  if (!ip || ip === 'Unknown' || ip === '0.0.0.0') {
    return { available: false, reason: 'No valid IP to check' };
  }

  if (!abuseKey) {
    return { available: false, reason: 'ABUSEIPDB_KEY not configured' };
  }

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: 90 },
      headers: { 'Key': abuseKey, 'Accept': 'application/json' },
      timeout: 5000
    });

    const d = response.data.data;
    return {
      available: true,
      ip,
      reputationScore: d.abuseConfidenceScore,
      totalReports: d.totalReports,
      isTorExitNode: d.isTor || false,
      countryCode: d.countryCode,
      isp: d.isp || 'Unknown',
      lastReportedAt: d.lastReportedAt || null,
    };
  } catch (error) {
    console.log('--> AbuseIPDB lookup failed:', error.message);
    return { available: false, reason: 'Lookup failed', detail: error.message };
  }
}

router.get('/lookup-ip/:ip', async (req, res) => {
  const result = await checkIpReputation(req.params.ip);
  return res.json({ status: 'success', data: result });
});

export default router;