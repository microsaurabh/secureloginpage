import { jest } from '@jest/globals';
import { PermissionService } from './permission.service.js';

describe('PermissionService', () => {
  it('creates a permission and records an audit entry', async () => {
    const permissions = {
      findByResourceAndAction: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        _id: 'perm-1',
        resource: 'users',
        action: 'read',
        description: 'View users',
        createdAt: new Date()
      }),
      updateById: jest.fn()
    };
    const roles = { model: { updateMany: jest.fn().mockResolvedValue({}) } };
    const auditLogs = { create: jest.fn().mockResolvedValue({}) };

    const service = new PermissionService({ permissions, roles, auditLogs });
    const result = await service.upsertPermission(
      { resource: 'users', action: 'read', description: 'View users' },
      'actor-1'
    );

    expect(permissions.create).toHaveBeenCalledWith(
      expect.objectContaining({ resource: 'users', action: 'read' })
    );
    expect(auditLogs.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'permission.created', actor: 'actor-1' })
    );
    expect(result.permission.resource).toBe('users');
  });
});
