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
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'investigations'
});

// Retention policy: auto-delete investigations after 90 days by default.
// Mongo TTL indexes run in the background — this doesn't block reads/writes.
investigationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

const Investigation = mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);

export default Investigation;