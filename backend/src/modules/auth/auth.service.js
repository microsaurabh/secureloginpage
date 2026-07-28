import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { env } from '../../config/env.js';
import { EmailService } from '../../services/email.service.js';
import { ApiError } from '../../utils/api-error.js';
import { createOpaqueToken, hashToken } from '../../utils/crypto.js';
import { signAccessToken } from '../../utils/jwt.js';
import { assertPasswordPolicy } from '../../utils/password-policy.js';
import { AuditLogRepository } from '../audit-logs/audit-log.repository.js';
import { LoginHistoryRepository } from '../login-history/login-history.repository.js';
import { PasswordResetRepository } from '../password-resets/password-reset.repository.js';
import { RefreshTokenRepository } from '../refresh-tokens/refresh-token.repository.js';
import { RoleRepository } from '../roles/role.repository.js';
import { UserRepository } from '../users/user.repository.js';

const toUser = (user) => ({
  id: user.id ?? user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  roles: user.roles.map((role) => role.name ?? role)
});
const expiry = (days) => new Date(Date.now() + days * 86_400_000);

export class AuthService {
  constructor(dependencies = {}) {
    this.users = dependencies.users ?? new UserRepository();
    this.roles = dependencies.roles ?? new RoleRepository();
    this.refreshTokens = dependencies.refreshTokens ?? new RefreshTokenRepository();
    this.passwordResets = dependencies.passwordResets ?? new PasswordResetRepository();
    this.loginHistory = dependencies.loginHistory ?? new LoginHistoryRepository();
    this.auditLogs = dependencies.auditLogs ?? new AuditLogRepository();
    this.email = dependencies.email ?? new EmailService();
  }

  async register(data) {
    assertPasswordPolicy(data.password);
    if (await this.users.findByEmail(data.email))
      throw new ApiError(
        409,
        'An account already exists for this email',
        undefined,
        'EMAIL_ALREADY_EXISTS'
      );
    this.email.getTransport();
    const role = await this.roles.findByName('USER');
    if (!role)
      throw new ApiError(503, 'Default roles have not been seeded', undefined, 'ROLES_NOT_SEEDED');
    const verificationToken = createOpaqueToken();
    const user = await this.users.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 12),
      roles: [role._id],
      emailVerificationTokenHash: hashToken(verificationToken),
      emailVerificationExpiresAt: expiry(1)
    });
    await this.email.sendVerificationEmail({ to: user.email, token: verificationToken });
    return { user: toUser(user) };
  }

  async login({ email, password, rememberMe = false, metadata = {} }) {
    const user = await this.users.findByEmail(email, true);
    const rejected = async (reason) => {
      await this.loginHistory.create({
        user: user?._id,
        successful: false,
        failureReason: reason,
        ...metadata
      });
      throw new ApiError(401, 'Invalid email or password', undefined, 'INVALID_CREDENTIALS');
    };
    if (!user || user.isDeleted || user.status === 'inactive')
      return rejected('invalid_credentials');
    if (user.lockedUntil && user.lockedUntil > new Date())
      throw new ApiError(423, 'Account is temporarily locked', undefined, 'ACCOUNT_LOCKED');
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      const attempts = user.failedLoginAttempts + 1;
      await this.users.updateById(user._id, {
        failedLoginAttempts: attempts,
        ...(attempts >= env.accountLockMaxAttempts
          ? {
              status: 'locked',
              lockedUntil: new Date(Date.now() + env.accountLockMinutes * 60_000)
            }
          : {})
      });
      return rejected('invalid_credentials');
    }
    const populated = await this.users.findByIdWithRoles(user._id);
    await this.users.updateById(user._id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      status: 'active'
    });
    await this.loginHistory.create({ user: user._id, successful: true, ...metadata });
    await this.auditLogs.create({
      actor: user._id,
      action: 'auth.login',
      resource: 'session',
      ...metadata
    });
    return this.issueSession(populated, rememberMe, metadata);
  }

  async issueSession(user, rememberMe, metadata, familyId = crypto.randomUUID()) {
    const token = createOpaqueToken();
    const expiresAt = expiry(rememberMe ? env.rememberMeTtlDays : env.refreshTokenTtlDays);
    const refreshToken = await this.refreshTokens.create({
      user: user._id,
      tokenHash: hashToken(token),
      familyId,
      rememberMe,
      expiresAt,
      ...metadata
    });
    return {
      accessToken: signAccessToken(user),
      refreshToken: token,
      refreshExpiresAt: expiresAt,
      user: toUser(user),
      refreshTokenId: refreshToken._id
    };
  }

  async refresh(token, metadata = {}) {
    const tokenHash = hashToken(token);
    const current = await this.refreshTokens.findActiveByHash(tokenHash);
    if (!current) {
      const known = await this.refreshTokens.findByHash(tokenHash);
      if (known) await this.refreshTokens.revokeFamily(known.familyId);
      throw new ApiError(
        401,
        'Refresh token is invalid or expired',
        undefined,
        'INVALID_REFRESH_TOKEN'
      );
    }
    const user = await this.users.findByIdWithRoles(current.user);
    if (!user || user.isDeleted || user.status !== 'active')
      throw new ApiError(401, 'Session is no longer active', undefined, 'SESSION_INACTIVE');
    const session = await this.issueSession(user, current.rememberMe, metadata, current.familyId);
    await this.refreshTokens.updateById(current._id, {
      revokedAt: new Date(),
      replacedBy: session.refreshTokenId
    });
    return session;
  }

  async logout(token) {
    if (!token) return;
    const record = await this.refreshTokens.findByHash(hashToken(token));
    if (record && !record.revokedAt)
      await this.refreshTokens.updateById(record._id, { revokedAt: new Date() });
  }

  async requestPasswordReset(email) {
    this.email.getTransport();
    const user = await this.users.findByEmail(email);
    if (!user) return;
    await this.passwordResets.invalidatePendingForUser(user._id);
    const token = createOpaqueToken();
    await this.passwordResets.create({
      user: user._id,
      tokenHash: hashToken(token),
      expiresAt: expiry(1)
    });
    await this.email.sendPasswordResetEmail({ to: user.email, token });
  }

  async resetPassword(token, password) {
    assertPasswordPolicy(password);
    const reset = await this.passwordResets.findUsableByHash(hashToken(token));
    if (!reset)
      throw new ApiError(
        400,
        'Password reset token is invalid or expired',
        undefined,
        'INVALID_RESET_TOKEN'
      );
    await this.users.updateById(reset.user, {
      passwordHash: await bcrypt.hash(password, 12),
      failedLoginAttempts: 0,
      lockedUntil: null,
      status: 'active'
    });
    await this.passwordResets.updateById(reset._id, { usedAt: new Date() });
    await this.refreshTokens.revokeForUser(reset.user);
  }

  async changePassword(userId, currentPassword, password) {
    assertPasswordPolicy(password);
    const user = await this.users.findById(userId, '+passwordHash');
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash)))
      throw new ApiError(
        400,
        'Current password is incorrect',
        undefined,
        'CURRENT_PASSWORD_INCORRECT'
      );
    await this.users.updateById(userId, { passwordHash: await bcrypt.hash(password, 12) });
    await this.refreshTokens.revokeForUser(userId);
  }

  async verifyEmail(token) {
    const user = await this.users.findByVerificationHash(hashToken(token));
    if (!user)
      throw new ApiError(
        400,
        'Verification token is invalid or expired',
        undefined,
        'INVALID_VERIFICATION_TOKEN'
      );
    await this.users.updateById(user._id, {
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null
    });
  }
}
