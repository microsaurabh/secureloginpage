import mongoose from 'mongoose';
import { softDeletePlugin } from '../../common/database/soft-delete.plugin.js';
import { PERMISSION_ACTIONS, SLUG_PATTERN } from '../../common/validators/database.validators.js';

const permissionSchema = new mongoose.Schema(
  {
    resource: { type: String, required: true, trim: true, lowercase: true, match: SLUG_PATTERN },
    action: { type: String, required: true, enum: PERMISSION_ACTIONS },
    description: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: true, versionKey: false }
);

permissionSchema.index(
  { resource: 1, action: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);
permissionSchema.plugin(softDeletePlugin);

export const Permission =
  mongoose.models.Permission || mongoose.model('Permission', permissionSchema);
