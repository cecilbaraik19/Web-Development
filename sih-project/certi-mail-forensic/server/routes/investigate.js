import express from 'express';
import axios from 'axios';
import Investigation from '../models/Investigation.js';
import AuditLog from '../models/AuditLog.js';
import { maskSensitiveContent } from '../utils/masking.js';

const router = express.Router();

router.post('/investigate', async (req, res) => {
  try {
    const { emailContent, maskBeforeStorage } = req.body;
    if (!emailContent || emailContent.length > 200000) {
      return res.status(400).json({ status: 'error', message: 'Invalid or oversized email content' });
    }

    const pythonBaseUrl = process.env.PYTHON_AI_URL || 'https://certimail-forensic-ai-service.onrender.com';
    const aiResponse = await axios.post(`${pythonBaseUrl}/analyze`, {
      raw_text: emailContent, // full content always sent to the analyzer — masking only applies to storage
    }, {
      timeout: 60000,
      headers: { 'x-internal-secret': process.env.INTERNAL_API_SECRET || '' }
    });

    const data = aiResponse.data;
    const shouldMask = !!maskBeforeStorage;
    const contentToStore = shouldMask ? maskSensitiveContent(emailContent) : emailContent;

    let recordId = "demo-case-998877";
    try {
      const newRecord = new Investigation({
        rawEmail: contentToStore,
        wasMasked: shouldMask,
        verdict: data.verdict,
        riskScore: data.risk_score,
        confidence: data.confidence,
        authentication: data.authentication,
        extractedIp: data.extracted_ip,
        estimatedGeo: data.estimated_geo,
        nlpIndicators: data.nlp_indicators,
        campaignTag: data.campaign_tag,
        mlLabel: data.ml_classification?.label,
      });
      await newRecord.save();
      recordId = newRecord._id;

      // Immutable audit trail entry — separate collection, never edited
      await AuditLog.create({
        action: 'ANALYZE_EMAIL',
        investigationId: newRecord._id,
        actor: req.headers['x-analyst-name'] || 'analyst',
        ipAddress: req.ip,
        verdict: data.verdict,
        riskScore: data.risk_score,
        wasMasked: shouldMask,
      });
    } catch (dbErr) {
      console.log('--> DB Save or audit log skipped:', dbErr.message);
    }

    return res.json({ status: 'success', report: data, caseId: recordId, wasMasked: shouldMask });
  } catch (error) {
    console.error('Investigate Error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      message: error.response?.data?.detail || error.message || 'Failed to connect to Python analyzer service'
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Investigation.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch history' });
  }
});

// Audit log viewer — read-only, for compliance/legal review
router.get('/audit-log', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch audit log' });
  }
});

export default router;