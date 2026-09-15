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
  threatIntel: {
    available: Boolean,
    reputationScore: Number,
    totalReports: Number,
    isTorExitNode: Boolean,
  },
  nlpIndicators: [String],
  campaignTag: String,
  clusterId: String,
  mlLabel: String,
  fullReport: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'investigations'
});

// NOTE: no index on createdAt here — retention.js owns that index exclusively
// (it needs expireAfterSeconds, which must be set/updated dynamically at
// startup, not fixed in the schema). Declaring it here too would create a
// duplicate index with conflicting options.
investigationSchema.index({ extractedIp: 1 });
investigationSchema.index({ extractedDomains: 1 });
investigationSchema.index({ verdict: 1 });
investigationSchema.index({ clusterId: 1 });

const Investigation = mongoose.models.Investigation || mongoose.model('Investigation', investigationSchema);

export default Investigation;