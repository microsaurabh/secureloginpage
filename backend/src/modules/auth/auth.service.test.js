import { jest } from '@jest/globals';
import { AuthService } from './auth.service.js';

describe('AuthService registration', () => {
  it('creates a password hash and sends an email verification token', async () => {
    const users = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (data) => ({ _id: 'user-1', ...data }))
    };
    const email = {
      getTransport: jest.fn(),
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined)
    };
    const service = new AuthService({
      users,
      roles: { findByName: jest.fn().mockResolvedValue({ _id: 'role-1' }) },
      email,
      refreshTokens: {},
      passwordResets: {},
      loginHistory: {},
      auditLogs: {}
    });
    const result = await service.register({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'SecurePassword1!'
    });
    expect(result.user.email).toBe('ada@example.com');
    expect(users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordHash: expect.not.stringMatching('SecurePassword1!'),
        emailVerificationTokenHash: expect.any(String)
      })
    );
    expect(email.sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'ada@example.com', token: expect.any(String) })
    );
  });
});
