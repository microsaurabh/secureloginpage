import { BaseRepository } from '../../common/repositories/base.repository.js';
import { LoginHistory } from './login-history.model.js';

export class LoginHistoryRepository extends BaseRepository {
  constructor(model = LoginHistory) {
    super(model);
  }

  findByUser(user, options = {}) {
    return this.model.find({ user }, null, { ...options, sort: { createdAt: -1 } });
  }
}
