import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  rawEmail: String,
  verdict: { type: String, required: true },
  riskScore: { type: Number, required: true },
  confidence: Number,
  authentication: {
    spf: String,
    dkim: String,
    dmarc: String
  },
  extractedIp: String,
  estimatedGeo: {
    city: String,
    country: String,
    lat: Number,
    lon: Number,
    isp: String
  },
  nlpIndicators: [String]
}, { 
  timestamps: true, 
  collection: 'investigations' // <-- Forces MongoDB to store it in this exact collection
});

const Investigation = mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);

export default Investigation;