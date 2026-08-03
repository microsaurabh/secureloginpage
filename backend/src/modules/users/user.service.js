import { ApiError } from '../../utils/api-error.js';
import { hashToken } from '../../utils/crypto.js';
import { createOpaqueToken } from '../../utils/crypto.js';
import { UserRepository } from './user.repository.js';
import { RoleRepository } from '../roles/role.repository.js';
import { RefreshTokenRepository } from '../refresh-tokens/refresh-token.repository.js';
import { PasswordResetRepository } from '../password-resets/password-reset.repository.js';
import { AuditLogRepository } from '../audit-logs/audit-log.repository.js';
import { AuditLog } from '../audit-logs/audit-log.model.js';
import { LoginHistory } from '../login-history/login-history.model.js';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(dependencies = {}) {
    this.users = dependencies.users ?? new UserRepository();
    this.roles = dependencies.roles ?? new RoleRepository();
    this.refreshTokens = dependencies.refreshTokens ?? new RefreshTokenRepository();
    this.passwordResets = dependencies.passwordResets ?? new PasswordResetRepository();
    this.auditLogs = dependencies.auditLogs ?? new AuditLogRepository();
  }

  async getUserProfile(userId) {
    const user = await this.users.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    return { user: this.toUser(user) };
  }

  async updateProfile(userId, data) {
    const user = await this.users.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }

    const allowedFields = ['firstName', 'lastName', 'avatarUrl'];
    const update = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => allowedFields.includes(key) && value !== undefined
      )
    );

    if (Object.keys(update).length === 0) {
      return { user: this.toUser(user) };
    }

    const updated = await this.users.updateById(userId, update);
    return { user: this.toUser(updated) };
  }

  async listUsers({
    page = 1,
    limit = 20,
    search = '',
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) {
    const query = { isDeleted: false };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      this.users.findPage(query, {
        skip: (page - 1) * limit,
        limit,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
      }),
      this.users.model.countDocuments(query)
    ]);

    return {
      items: items.map((item) => this.toUser(item)),
      total,
      page,
      limit
    };
  }

  async setUserStatus(userId, status, actorId) {
    const target = await this.users.findById(userId);
    if (!target || target.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    const updated = await this.users.updateById(userId, { status });
    await this.auditLogs.create({
      actor: actorId,
      action: 'user.status.updated',
      resource: 'users',
      targetId: userId,
      metadata: { status }
    });
    return { user: this.toUser(updated) };
  }

  async resetPassword(userId, actorId) {
    const target = await this.users.findById(userId);
    if (!target || target.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    const token = createOpaqueToken();
    await this.passwordResets.create({
      user: userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    await this.refreshTokens.revokeForUser(userId);
    await this.auditLogs.create({
      actor: actorId,
      action: 'user.password.reset',
      resource: 'users',
      targetId: userId
    });
    return { token };
  }

  async deleteUser(userId, actorId) {
    const target = await this.users.findById(userId);
    if (!target || target.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    await this.users.softDeleteById(userId);
    await this.refreshTokens.revokeForUser(userId);
    await this.auditLogs.create({
      actor: actorId,
      action: 'user.deleted',
      resource: 'users',
      targetId: userId
    });
  }

  async assignRoles(userId, roleIds, actorId) {
    const target = await this.users.findById(userId);
    if (!target || target.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }

    const updated = await this.users.updateById(userId, { roles: roleIds });
    await this.auditLogs.create({
      actor: actorId,
      action: 'user.roles.updated',
      resource: 'users',
      targetId: userId,
      metadata: { roles: roleIds }
    });
    return { user: this.toUser(updated) };
  }

  async changePassword(userId, currentPassword, password) {
    const user = await this.users.findById(userId, '+passwordHash');
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new ApiError(
        400,
        'Current password is incorrect',
        undefined,
        'CURRENT_PASSWORD_INCORRECT'
      );
    }
    await this.users.updateById(userId, { passwordHash: await bcrypt.hash(password, 12) });
    await this.refreshTokens.revokeForUser(userId);
  }

  async getLoginHistory(userId) {
    const user = await this.users.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    const records = await LoginHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    return { items: records ?? [] };
  }

  async getAuditLogs(userId) {
    const user = await this.users.findById(userId);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'User not found', undefined, 'USER_NOT_FOUND');
    }
    const records = await AuditLog.find({ actor: userId }).sort({ createdAt: -1 }).limit(20);
    return { items: records ?? [] };
  }

  toUser(user) {
    return {
      id: user.id ?? user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles?.map((role) => role.name ?? role) ?? [],
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    };
  }
}
