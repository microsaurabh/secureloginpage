import { ApiError } from '../../utils/api-error.js';
import { AuditLogRepository } from '../audit-logs/audit-log.repository.js';
import { PermissionRepository } from '../permissions/permission.repository.js';
import { RoleRepository } from './role.repository.js';

export class RoleService {
  constructor(dependencies = {}) {
    this.roles = dependencies.roles ?? new RoleRepository();
    this.permissions = dependencies.permissions ?? new PermissionRepository();
    this.auditLogs = dependencies.auditLogs ?? new AuditLogRepository();
  }

  async listRoles({ search = '' } = {}) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await this.roles.find(query, { sort: { name: 1 } });
    return { items };
  }

  async getRole(roleId) {
    const role = await this.roles.findById(roleId).populate('permissions');
    if (!role || role.isDeleted) {
      throw new ApiError(404, 'Role not found', undefined, 'ROLE_NOT_FOUND');
    }
    return { role: this.toRole(role) };
  }

  async upsertRole(data, actorId) {
    const existing = await this.roles.findOne({ name: data.name.toUpperCase() });
    const normalized = {
      name: data.name.toUpperCase(),
      description: data.description,
      permissions: data.permissions ?? [],
      isSystem: data.isSystem ?? false
    };

    const role = existing
      ? await this.roles.updateById(existing._id, normalized)
      : await this.roles.create(normalized);

    await this.auditLogs.create({
      actor: actorId,
      action: existing ? 'role.updated' : 'role.created',
      resource: 'roles',
      targetId: role._id.toString()
    });

    return { role: this.toRole(role) };
  }

  async deleteRole(roleId, actorId) {
    const role = await this.roles.findById(roleId);
    if (!role || role.isDeleted) {
      throw new ApiError(404, 'Role not found', undefined, 'ROLE_NOT_FOUND');
    }
    if (role.isSystem) {
      throw new ApiError(400, 'System roles cannot be deleted', undefined, 'SYSTEM_ROLE_DELETE');
    }
    await this.roles.softDeleteById(roleId);
    await this.auditLogs.create({
      actor: actorId,
      action: 'role.deleted',
      resource: 'roles',
      targetId: roleId
    });
  }

  async addPermissionsToRole(roleId, permissionIds, actorId) {
    const role = await this.roles.findById(roleId);
    if (!role || role.isDeleted) {
      throw new ApiError(404, 'Role not found', undefined, 'ROLE_NOT_FOUND');
    }

    const updated = await this.roles.updateById(roleId, { permissions: permissionIds });
    await this.auditLogs.create({
      actor: actorId,
      action: 'role.permissions.updated',
      resource: 'roles',
      targetId: roleId,
      metadata: { permissions: permissionIds }
    });
    return { role: this.toRole(updated) };
  }

  toRole(role) {
    return {
      id: role.id ?? role._id.toString(),
      name: role.name,
      description: role.description,
      permissions: (role.permissions ?? []).map((permission) =>
        permission.id ? permission.id : permission.toString()
      ),
      isSystem: role.isSystem,
      createdAt: role.createdAt
    };
  }
}
