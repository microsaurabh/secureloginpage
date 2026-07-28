import mongoose from 'mongoose';
import { softDeletePlugin } from '../../common/database/soft-delete.plugin.js';
import { ROLE_NAME_PATTERN } from '../../common/validators/database.validators.js';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, uppercase: true, match: ROLE_NAME_PATTERN },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    isSystem: { type: Boolean, default: false, immutable: true }
  },
  { timestamps: true, versionKey: false }
);

roleSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
roleSchema.plugin(softDeletePlugin);

export const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
