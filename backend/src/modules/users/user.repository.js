import { BaseRepository } from '../../common/repositories/base.repository.js';
import { User } from './user.model.js';

export class UserRepository extends BaseRepository {
  constructor(model = User) {
    super(model);
  }

  findByEmail(email, includePassword = false) {
    const query = this.model.findOne({ email: email.toLowerCase() });
    return includePassword ? query.select('+passwordHash') : query;
  }

  findByIdWithRoles(id) {
    return this.model.findById(id).populate({
      path: 'roles',
      populate: { path: 'permissions' }
    });
  }

  findPage(filter, { skip, limit, sort }) {
    return this.model
      .find(filter)
      .select('firstName lastName email roles status avatarUrl createdAt')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  findByVerificationHash(tokenHash) {
    return this.model
      .findOne({
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpiresAt: { $gt: new Date() }
      })
      .select('+emailVerificationTokenHash');
  }
}
