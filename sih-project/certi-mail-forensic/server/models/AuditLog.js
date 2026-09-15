import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. 'ANALYZE_EMAIL', 'VIEW_HISTORY'
  investigationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investigation' },
  actor: { type: String, default: 'analyst' }, // placeholder until real auth/accounts exist
  ipAddress: String,
  verdict: String,
  riskScore: Number,
  wasMasked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now, immutable: true },
}, {
  collection: 'audit_logs',
  // No updatedAt on purpose — audit entries should never be edited, only created
});

// Prevent accidental modification of existing entries at the schema level
auditLogSchema.pre('findOneAndUpdate', function (next) {
  next(new Error('Audit log entries are immutable and cannot be updated.'));
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;