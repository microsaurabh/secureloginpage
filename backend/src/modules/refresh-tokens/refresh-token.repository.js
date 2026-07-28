import { BaseRepository } from '../../common/repositories/base.repository.js';
import { RefreshToken } from './refresh-token.model.js';

export class RefreshTokenRepository extends BaseRepository {
  constructor(model = RefreshToken) {
    super(model);
  }

  findActiveByHash(tokenHash) {
    return this.model
      .findOne({ tokenHash, revokedAt: null, expiresAt: { $gt: new Date() } })
      .select('+tokenHash');
  }

  revokeFamily(familyId) {
    return this.model.updateMany({ familyId, revokedAt: null }, { revokedAt: new Date() });
  }
}
