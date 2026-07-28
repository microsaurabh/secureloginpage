import { ApiError } from '../../utils/api-error.js';
import { PermissionRepository } from './permission.repository.js';
import { AuditLogRepository } from '../audit-logs/audit-log.repository.js';
import { RoleRepository } from '../roles/role.repository.js';

export class PermissionService {
  constructor(dependencies = {}) {
    this.permissions = dependencies.permissions ?? new PermissionRepository();
    this.roles = dependencies.roles ?? new RoleRepository();
    this.auditLogs = dependencies.auditLogs ?? new AuditLogRepository();
  }

  async listPermissions({ search = '' } = {}) {
    const query = {};
    if (search) {
      query.$or = [
        { resource: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await this.permissions.find(query, { sort: { resource: 1, action: 1 } });
    return { items };
  }

  async upsertPermission(data, actorId) {
    const existing = await this.permissions.findByResourceAndAction(data.resource, data.action);
    const normalized = {
      resource: data.resource.toLowerCase(),
      action: data.action,
      description: data.description ?? `${data.action} access to ${data.resource}`
    };

    const permission = existing
      ? await this.permissions.updateById(existing._id, normalized)
      : await this.permissions.create(normalized);

    await this.auditLogs.create({
      actor: actorId,
      action: existing ? 'permission.updated' : 'permission.created',
      resource: 'permissions',
      targetId: permission._id.toString()
    });

    return { permission: this.toPermission(permission) };
  }

  async deletePermission(permissionId, actorId) {
    const permission = await this.permissions.findById(permissionId);
    if (!permission || permission.isDeleted) {
      throw new ApiError(404, 'Permission not found', undefined, 'PERMISSION_NOT_FOUND');
    }
    await this.permissions.softDeleteById(permissionId);
    await this.roles.model.updateMany({}, { $pull: { permissions: permissionId } });
    await this.auditLogs.create({
      actor: actorId,
      action: 'permission.deleted',
      resource: 'permissions',
      targetId: permissionId
    });
  }

  toPermission(permission) {
    return {
      id: permission.id ?? permission._id.toString(),
      resource: permission.resource,
      action: permission.action,
      description: permission.description,
      createdAt: permission.createdAt
    };
  }
}
