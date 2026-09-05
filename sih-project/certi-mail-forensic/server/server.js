import dns from 'dns';
// Force Node.js to use Google's DNS servers directly, bypassing local network blocks
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


// Connect MongoDB 
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/certimailforensic';

mongoose.connect(MONGODB_URI, {
  dbName: 'certimailforensic',
  family: 4,               // IPv4 force karega taaki DNS routing block na ho
  serverSelectionTimeoutMS: 10000 // 10 seconds mein connect ya fail hoga, hang nahi rahega
})
.then(() => console.log(`Connected to MongoDB. Active Database: ${mongoose.connection.name}`))
.catch((err) => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/intel', threatIntelRoutes);

app.post('/api/investigate', async (req, res) => {
  try {
    console.log('--> Incoming request received at /api/investigate');
    const { emailContent } = req.body;

    const pythonBaseUrl = process.env.PYTHON_AI_URL || 'http://127.0.0.1:8000';

    const aiResponse = await axios.post(`${pythonBaseUrl}/analyze`, {
      raw_text: emailContent,
    });

    const data = aiResponse.data;
    console.log('--> AI Analysis received. Verdict:', data.verdict);

    const newRecord = new Investigation({
      rawEmail: emailContent,
      verdict: data.verdict,
      riskScore: data.risk_score,
      confidence: data.confidence,
      authentication: data.authentication,
      extractedIp: data.extracted_ip,
      estimatedGeo: data.estimated_geo,
      nlpIndicators: data.nlp_indicators,
    });

    await newRecord.save();
    console.log('--> SUCCESS: Saved to database with ID:', newRecord._id);

    return res.json({
      status: 'success',
      report: data,
      caseId: newRecord._id,
    });
  } catch (error) {
    console.error('--> ERROR in investigation endpoint:', error.response?.data || error.message);
    res.status(500).json({ status: 'error', message: 'Failed to process AI investigation' });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node backend running on http://localhost:${PORT}`);
});