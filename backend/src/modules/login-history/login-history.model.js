import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    successful: { type: Boolean, required: true, index: true },
    failureReason: { type: String, trim: true, maxlength: 250, default: null },
    ipAddress: { type: String, trim: true, maxlength: 45, default: null },
    userAgent: { type: String, trim: true, maxlength: 1024, default: null }
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

loginHistorySchema.index({ user: 1, createdAt: -1 });
loginHistorySchema.index({ successful: 1, createdAt: -1 });

export const LoginHistory =
  mongoose.models.LoginHistory || mongoose.model('LoginHistory', loginHistorySchema);
