import mongoose from 'mongoose';

const investigationSchema = new mongoose.Schema({
  rawEmail: String,
  wasMasked: { type: Boolean, default: false },
  verdict: { type: String, required: true },
  riskScore: { type: Number, required: true },
  confidence: Number,
  authentication: {
    spf: String,
    dkim: String,
    dmarc: String
  },
  extractedIp: String,
  extractedDomains: [String],
  estimatedGeo: {
    city: String,
    country: String,
    lat: Number,
    lon: Number,
    isp: String
  },
  nlpIndicators: [String],
  campaignTag: String,
  mlLabel: String,
  fullReport: mongoose.Schema.Types.Mixed, // stores the complete analyzer response, for reopening a case later
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'investigations'
});

investigationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
investigationSchema.index({ extractedIp: 1 });
investigationSchema.index({ extractedDomains: 1 });
investigationSchema.index({ verdict: 1 });

const Investigation = mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);

export default Investigation;