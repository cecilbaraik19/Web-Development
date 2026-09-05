import express from 'express';

const router = express.Router();

router.get('/lookup-ip/:ip', async (req, res) => {
  const { ip } = req.params;

  try {
    const threatData = {
      ip,
      reputationScore: ip.startsWith('185') ? 85 : 10,
      blacklistsMatched: ip.startsWith('185') ? ['Spamhaus', 'SURBL'] : [],
      asn: 'AS13335 Cloudflare, Inc.',
      isTorExitNode: false
    };

    return res.json({ status: 'success', data: threatData });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Threat lookup failed' });
  }
});

export default router;