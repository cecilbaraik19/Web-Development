import express from 'express';
import { issueSessionToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { passphrase } = req.body;
  const correctPassphrase = process.env.ANALYST_PASSPHRASE;

  if (!correctPassphrase) {
    return res.status(500).json({ status: 'error', message: 'Server not configured with ANALYST_PASSPHRASE.' });
  }

  if (passphrase !== correctPassphrase) {
    return res.status(401).json({ status: 'error', message: 'Incorrect passphrase.' });
  }

  const token = issueSessionToken();
  return res.json({ status: 'success', token, expiresIn: '8h' });
});

export default router;