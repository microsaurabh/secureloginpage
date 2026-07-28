import { BaseRepository } from '../../common/repositories/base.repository.js';
import { AuditLog } from './audit-log.model.js';

export class AuditLogRepository extends BaseRepository {
  constructor(model = AuditLog) {
    super(model);
  }

  findByActor(actor, options = {}) {
    return this.model.find({ actor }, null, { ...options, sort: { createdAt: -1 } });
  }
}
