import { BaseRepository } from '../../common/repositories/base.repository.js';
import { Role } from './role.model.js';

export class RoleRepository extends BaseRepository {
  constructor(model = Role) {
    super(model);
  }

  findByName(name) {
    return this.model.findOne({ name: name.toUpperCase() }).populate('permissions');
  }
}
