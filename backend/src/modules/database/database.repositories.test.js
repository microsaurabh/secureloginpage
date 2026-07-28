import { jest } from '@jest/globals';
import { AuditLogRepository } from '../audit-logs/audit-log.repository.js';
import { LoginHistoryRepository } from '../login-history/login-history.repository.js';
import { PasswordResetRepository } from '../password-resets/password-reset.repository.js';
import { PermissionRepository } from '../permissions/permission.repository.js';
import { RefreshTokenRepository } from '../refresh-tokens/refresh-token.repository.js';
import { RoleRepository } from '../roles/role.repository.js';
import { UserRepository } from '../users/user.repository.js';

describe('specialized database repositories', () => {
  it('builds user and role lookup queries', () => {
    const userQuery = { select: jest.fn().mockReturnValue('selected-user') };
    const userModel = {
      findOne: jest.fn().mockReturnValue(userQuery),
      findById: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue('populated-user') })
    };
    const roleQuery = { populate: jest.fn().mockReturnValue('populated-role') };
    const roleModel = { findOne: jest.fn().mockReturnValue(roleQuery) };

    expect(new UserRepository(userModel).findByEmail('ADA@EXAMPLE.COM', true)).toBe(
      'selected-user'
    );
    expect(new UserRepository(userModel).findByIdWithRoles('user-1')).toBe('populated-user');
    expect(new RoleRepository(roleModel).findByName('admin')).toBe('populated-role');
    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'ada@example.com' });
    expect(roleModel.findOne).toHaveBeenCalledWith({ name: 'ADMIN' });
  });

  it('builds permission and token lifecycle queries', () => {
    const permissionModel = { findOne: jest.fn().mockReturnValue('permission') };
    const refreshQuery = { select: jest.fn().mockReturnValue('refresh-token') };
    const refreshModel = {
      findOne: jest.fn().mockReturnValue(refreshQuery),
      updateMany: jest.fn().mockReturnValue('revoked')
    };
    const resetQuery = { select: jest.fn().mockReturnValue('password-reset') };
    const resetModel = {
      findOne: jest.fn().mockReturnValue(resetQuery),
      updateMany: jest.fn().mockReturnValue('invalidated')
    };

    expect(new PermissionRepository(permissionModel).findByResourceAndAction('USERS', 'read')).toBe(
      'permission'
    );
    expect(new RefreshTokenRepository(refreshModel).findActiveByHash('hash')).toBe('refresh-token');
    expect(new RefreshTokenRepository(refreshModel).revokeFamily('family-1')).toBe('revoked');
    expect(new PasswordResetRepository(resetModel).findUsableByHash('hash')).toBe('password-reset');
    expect(new PasswordResetRepository(resetModel).invalidatePendingForUser('user-1')).toBe(
      'invalidated'
    );
    expect(permissionModel.findOne).toHaveBeenCalledWith({ resource: 'users', action: 'read' });
    expect(refreshModel.updateMany).toHaveBeenCalledWith(
      { familyId: 'family-1', revokedAt: null },
      { revokedAt: expect.any(Date) }
    );
    expect(resetModel.updateMany).toHaveBeenCalledWith(
      { user: 'user-1', usedAt: null },
      { usedAt: expect.any(Date) }
    );
  });

  it('applies descending chronological order to security histories', () => {
    const auditModel = { find: jest.fn().mockReturnValue('audit-events') };
    const loginModel = { find: jest.fn().mockReturnValue('login-events') };

    expect(new AuditLogRepository(auditModel).findByActor('user-1', { limit: 20 })).toBe(
      'audit-events'
    );
    expect(new LoginHistoryRepository(loginModel).findByUser('user-1', { limit: 20 })).toBe(
      'login-events'
    );
    expect(auditModel.find).toHaveBeenCalledWith({ actor: 'user-1' }, null, {
      limit: 20,
      sort: { createdAt: -1 }
    });
    expect(loginModel.find).toHaveBeenCalledWith({ user: 'user-1' }, null, {
      limit: 20,
      sort: { createdAt: -1 }
    });
  });
});
