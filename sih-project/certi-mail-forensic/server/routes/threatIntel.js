import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/lookup-ip/:ip', async (req, res) => {
  const { ip } = req.params;
  const abuseKey = process.env.ABUSEIPDB_KEY;

  if (!abuseKey) {
    return res.json({
      status: 'success',
      data: { ip, reputationScore: null, note: 'ABUSEIPDB_KEY not configured — real lookup unavailable' }
    });
  }

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: 90 },
      headers: { 'Key': abuseKey, 'Accept': 'application/json' },
      timeout: 5000
    });

    const d = response.data.data;
    return res.json({
      status: 'success',
      data: {
        ip,
        reputationScore: d.abuseConfidenceScore,
        totalReports: d.totalReports,
        isTorExitNode: d.isTor || false,
        countryCode: d.countryCode,
        isp: d.isp || 'Unknown'
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Threat lookup failed', detail: error.message });
  }
});

export default router;