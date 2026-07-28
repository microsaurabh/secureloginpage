import { BaseRepository } from '../../common/repositories/base.repository.js';
import { PasswordReset } from './password-reset.model.js';

export class PasswordResetRepository extends BaseRepository {
  constructor(model = PasswordReset) {
    super(model);
  }

  findUsableByHash(tokenHash) {
    return this.model
      .findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } })
      .select('+tokenHash');
  }

  invalidatePendingForUser(user) {
    return this.model.updateMany({ user, usedAt: null }, { usedAt: new Date() });
  }
}
