import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    action: { type: String, required: true, trim: true, maxlength: 100, index: true },
    resource: { type: String, required: true, trim: true, maxlength: 100, index: true },
    targetId: { type: String, trim: true, maxlength: 100, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    requestId: { type: String, trim: true, maxlength: 100, default: null, index: true },
    ipAddress: { type: String, trim: true, maxlength: 45, default: null }
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

auditLogSchema.index({ createdAt: -1, action: 1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
