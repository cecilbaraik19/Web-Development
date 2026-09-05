import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  rawEmail: { type: String, required: true },
  verdict: { type: String, required: true },
  riskScore: { type: Number, required: true },
  confidence: { type: Number, required: true },
  authentication: {
    spf: String,
    dkim: String,
    dmarc: String,
  },
  extractedIp: String,
  estimatedGeo: {
    country: String,
    city: String,
    isp: String,
  },
  nlpIndicators: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Investigation', investigationSchema);