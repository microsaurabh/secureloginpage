import { BaseRepository } from '../../common/repositories/base.repository.js';
import { Permission } from './permission.model.js';

export class PermissionRepository extends BaseRepository {
  constructor(model = Permission) {
    super(model);
  }

  findByResourceAndAction(resource, action) {
    return this.model.findOne({ resource: resource.toLowerCase(), action });
  }
}
