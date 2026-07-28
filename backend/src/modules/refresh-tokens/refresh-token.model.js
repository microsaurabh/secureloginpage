import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, select: false },
    familyId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: { type: Date, default: null, index: true },
    replacedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken', default: null },
    userAgent: { type: String, trim: true, maxlength: 1024, default: null },
    ipAddress: { type: String, trim: true, maxlength: 45, default: null }
  },
  { timestamps: true, versionKey: false }
);

refreshTokenSchema.index({ user: 1, familyId: 1, revokedAt: 1 });

export const RefreshToken =
  mongoose.models.RefreshToken || mongoose.model('RefreshToken', refreshTokenSchema);
