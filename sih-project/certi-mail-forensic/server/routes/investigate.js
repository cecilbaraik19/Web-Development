import express from 'express';
import axios from 'axios';
import Investigation from '../models/Investigation.js';
import AuditLog from '../models/AuditLog.js';
import { maskSensitiveContent } from '../utils/masking.js';
import { findRelatedCases, assignClusterId } from '../utils/correlation.js';
import { checkIpReputation } from './threatIntel.js';

const router = express.Router();

router.post('/investigate', async (req, res) => {
  try {
    const { emailContent, maskBeforeStorage } = req.body;
    if (!emailContent || emailContent.length > 200000) {
      return res.status(400).json({ status: 'error', message: 'Invalid or oversized email content' });
    }

    const pythonBaseUrl = process.env.PYTHON_AI_URL || 'https://certimail-forensic-ai-service.onrender.com';
    const aiResponse = await axios.post(`${pythonBaseUrl}/analyze`, {
      raw_text: emailContent,
    }, {
      timeout: 60000,
      headers: { 'x-internal-secret': process.env.INTERNAL_API_SECRET || '' }
    });

    const data = aiResponse.data;

    // --- Real IP reputation check (previously built but never called) ---
    const threatIntel = await checkIpReputation(data.extracted_ip);
    data.threat_intel = threatIntel;

    // Reputation feeds back into risk scoring — a known-abusive IP should raise risk
    if (threatIntel.available && threatIntel.reputationScore >= 50) {
      data.risk_score = Math.min(100, data.risk_score + 15);
      data.nlp_indicators = [
        `AbuseIPDB reputation score: ${threatIntel.reputationScore}/100 (${threatIntel.totalReports} reports)`,
        ...data.nlp_indicators
      ];
      data.verdict = data.risk_score >= 60 ? 'MALICIOUS' : data.risk_score >= 35 ? 'SUSPICIOUS' : data.verdict;
    }

    const shouldMask = !!maskBeforeStorage;
    const contentToStore = shouldMask ? maskSensitiveContent(emailContent) : emailContent;

    let recordId = "demo-case-998877";
    let relatedCases = [];
    let clusterId = null;

    try {
      const correlationInput = {
        extractedIp: data.extracted_ip,
        extractedDomains: data.extracted_domains || [],
        estimatedGeo: data.estimated_geo,
      };

      relatedCases = await findRelatedCases(correlationInput);
      clusterId = assignClusterId(relatedCases);

      const newRecord = new Investigation({
        rawEmail: contentToStore,
        wasMasked: shouldMask,
        verdict: data.verdict,
        riskScore: data.risk_score,
        confidence: data.confidence,
        authentication: data.authentication,
        extractedIp: data.extracted_ip,
        extractedDomains: data.extracted_domains || [],
        estimatedGeo: data.estimated_geo,
        threatIntel: {
          available: threatIntel.available,
          reputationScore: threatIntel.reputationScore ?? null,
          totalReports: threatIntel.totalReports ?? null,
          isTorExitNode: threatIntel.isTorExitNode ?? false,
        },
        nlpIndicators: data.nlp_indicators,
        campaignTag: data.campaign_tag,
        clusterId,
        mlLabel: data.ml_classification?.label,
        fullReport: data,
      });
      await newRecord.save();
      recordId = newRecord._id;

      const idsToBackfill = relatedCases.filter((c) => !c.clusterId).map((c) => c._id);
      if (idsToBackfill.length > 0) {
        await Investigation.updateMany(
          { _id: { $in: idsToBackfill } },
          { $set: { clusterId } }
        );
      }

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
      console.log('--> DB Save, correlation, or audit log skipped:', dbErr.message);
    }

    return res.json({
      status: 'success',
      report: data,
      caseId: recordId,
      wasMasked: shouldMask,
      clusterId,
      relatedCases,
    });
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

router.get('/cases', async (req, res) => {
  try {
    const { query, verdict, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (verdict && verdict !== 'ALL') filter.verdict = verdict;
    if (query) {
      filter.$or = [
        { extractedIp: { $regex: query, $options: 'i' } },
        { extractedDomains: { $regex: query, $options: 'i' } },
        { campaignTag: { $regex: query, $options: 'i' } },
        { clusterId: { $regex: query, $options: 'i' } },
      ];
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [cases, total] = await Promise.all([
      Investigation.find(filter).select('-rawEmail -fullReport').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Investigation.countDocuments(filter)
    ]);

    res.json({ cases, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to search cases' });
  }
});

router.get('/cases/:id', async (req, res) => {
  try {
    const record = await Investigation.findById(req.params.id);
    if (!record) return res.status(404).json({ status: 'error', message: 'Case not found' });

    const correlationInput = {
      extractedIp: record.extractedIp,
      extractedDomains: record.extractedDomains || [],
      estimatedGeo: record.estimatedGeo,
    };
    const relatedCases = await findRelatedCases(correlationInput, record._id);

    res.json({
      status: 'success',
      report: record.fullReport || {
        verdict: record.verdict,
        risk_score: record.riskScore,
        confidence: record.confidence,
        authentication: record.authentication,
        extracted_ip: record.extractedIp,
        extracted_domains: record.extractedDomains,
        estimated_geo: record.estimatedGeo,
        nlp_indicators: record.nlpIndicators,
        campaign_tag: record.campaignTag,
      },
      caseId: record._id,
      clusterId: record.clusterId,
      relatedCases,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch case' });
  }
});

router.get('/audit-log', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch audit log' });
  }
});

export default router;