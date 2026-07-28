import mongoose from 'mongoose';
import { softDeletePlugin } from '../../common/database/soft-delete.plugin.js';
import { EMAIL_PATTERN } from '../../common/validators/database.validators.js';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: EMAIL_PATTERN,
      maxlength: 254
    },
    passwordHash: { type: String, required: true, select: false },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    avatarUrl: { type: String, trim: true, maxlength: 2048, default: null },
    status: {
      type: String,
      enum: ['active', 'inactive', 'locked'],
      default: 'active',
      index: true
    },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationTokenHash: { type: String, select: false, default: null },
    emailVerificationExpiresAt: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0, min: 0 },
    lockedUntil: { type: Date, default: null }
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
userSchema.plugin(softDeletePlugin);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
