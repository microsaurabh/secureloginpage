import mongoose from 'mongoose';
import { AuditLog } from '../audit-logs/audit-log.model.js';
import { LoginHistory } from '../login-history/login-history.model.js';
import { PasswordReset } from '../password-resets/password-reset.model.js';
import { Permission } from '../permissions/permission.model.js';
import { RefreshToken } from '../refresh-tokens/refresh-token.model.js';
import { Role } from '../roles/role.model.js';
import { User } from '../users/user.model.js';

const objectId = new mongoose.Types.ObjectId();

describe('database models', () => {
  it('validates and normalizes a user document', () => {
    const user = new User({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ADA@EXAMPLE.COM',
      passwordHash: 'a-secure-hash'
    });

    expect(user.validateSync()).toBeUndefined();
    expect(user.email).toBe('ada@example.com');
    expect(user.isDeleted).toBe(false);
    expect(
      new User({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'invalid',
        passwordHash: 'x'
      }).validateSync().errors.email
    ).toBeDefined();
  });

  it('enforces role and permission domain constraints', () => {
    expect(
      new Role({ name: 'ADMIN', description: 'Administrator' }).validateSync()
    ).toBeUndefined();
    expect(
      new Role({ name: 'ADMIN-ROLE', description: 'Administrator' }).validateSync().errors.name
    ).toBeDefined();
    expect(
      new Permission({
        resource: 'users',
        action: 'read',
        description: 'Read users'
      }).validateSync()
    ).toBeUndefined();
    expect(
      new Permission({
        resource: 'Users',
        action: 'publish',
        description: 'Invalid'
      }).validateSync().errors.action
    ).toBeDefined();
  });

  it('requires lifecycle values for security token documents', () => {
    const expiry = new Date(Date.now() + 60_000);
    expect(
      new RefreshToken({
        user: objectId,
        tokenHash: 'hash',
        familyId: 'family',
        expiresAt: expiry
      }).validateSync()
    ).toBeUndefined();
    expect(
      new PasswordReset({ user: objectId, tokenHash: 'hash', expiresAt: expiry }).validateSync()
    ).toBeUndefined();
  });

  it('defines indexes for uniqueness, expiry, and high-volume lookup paths', () => {
    const hasIndex = (model, key) =>
      model.schema.indexes().some(([fields]) => JSON.stringify(fields) === JSON.stringify(key));

    expect(hasIndex(User, { email: 1 })).toBe(true);
    expect(hasIndex(Role, { name: 1 })).toBe(true);
    expect(hasIndex(Permission, { resource: 1, action: 1 })).toBe(true);
    expect(hasIndex(RefreshToken, { expiresAt: 1 })).toBe(true);
    expect(hasIndex(PasswordReset, { expiresAt: 1 })).toBe(true);
    expect(hasIndex(AuditLog, { actor: 1, createdAt: -1 })).toBe(true);
    expect(hasIndex(LoginHistory, { user: 1, createdAt: -1 })).toBe(true);
  });
});
