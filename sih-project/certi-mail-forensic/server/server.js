import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Investigation from './models/Investigation.js';
import threatIntelRoutes from './routes/threatIntel.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'CertiMail Forensic Backend is Live!',
    endpoints: {
      investigate: 'POST /api/investigate',
      history: 'GET /api/history',
      intel: 'GET /api/intel'
    }
  });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/certimailforensic';

mongoose.connect(MONGODB_URI, {
  dbName: 'certimailforensic',
  family: 4,
  serverSelectionTimeoutMS: 10000
})
.then(() => console.log(`Connected to MongoDB. Active Database: ${mongoose.connection.name}`))
.catch((err) => console.error('MongoDB connection error:', err.message));

app.use('/api/intel', threatIntelRoutes);

app.post('/api/investigate', async (req, res) => {
  try {
    console.log('--> Incoming request received at /api/investigate');
    const { emailContent } = req.body;

    const pythonBaseUrl = process.env.PYTHON_AI_URL || 'https://certimail-forensic-ai-service.onrender.com';
    console.log(`--> Forwarding request to Python service at: ${pythonBaseUrl}/analyze`);
    
    const aiResponse = await axios.post(`${pythonBaseUrl}/analyze`, {
      raw_text: emailContent,
    }, { timeout: 30000 });
    
    const data = aiResponse.data;

    let recordId = "demo-case-998877";
    try {
      const newRecord = new Investigation({
        rawEmail: emailContent || "Raw Header Input",
        verdict: data.verdict,
        riskScore: data.risk_score,
        confidence: data.confidence,
        authentication: data.authentication,
        extractedIp: data.extracted_ip,
        estimatedGeo: data.estimated_geo,
        nlpIndicators: data.nlp_indicators,
      });
      await newRecord.save();
      recordId = newRecord._id;
    } catch (dbErr) {
      console.log('--> DB Save skipped:', dbErr.message);
    }

    return res.json({
      status: 'success',
      report: data,
      caseId: recordId,
    });
  } catch (error) {
    console.error('Critical Endpoint Error:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'error', 
      message: error.response?.data?.detail || error.message || 'Failed to connect to Python analyzer service' 
    });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await Investigation.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch history' });
  }
});

const PORT = process.env.PORT || 5000 || 10000;
app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`);
});