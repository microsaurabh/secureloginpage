import { jest } from '@jest/globals';
import { RoleService } from './role.service.js';

describe('RoleService', () => {
  it('creates a role and records an audit entry', async () => {
    const roles = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ _id: 'role-1', name: 'MANAGER', description: 'Manager' }),
      updateById: jest.fn()
    };
    const auditLogs = { create: jest.fn().mockResolvedValue({}) };

    const service = new RoleService({ roles, permissions: {}, auditLogs });
    const result = await service.upsertRole(
      { name: 'manager', description: 'Manager', permissions: [] },
      'actor-1'
    );

    expect(roles.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'MANAGER' }));
    expect(auditLogs.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'role.created' })
    );
    expect(result.role.name).toBe('MANAGER');
  });
});
