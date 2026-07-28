import { jest } from '@jest/globals';
import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../middlewares/error-handler.js';
import { createAuthRouter } from './auth.routes.js';

const appFor = (service) => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/v1/auth', createAuthRouter(service));
  app.use(errorHandler);
  return app;
};

describe('authentication API routes', () => {
  const service = {
    login: jest.fn().mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      refreshExpiresAt: new Date(Date.now() + 60_000),
      user: { id: 'user-1' }
    }),
    requestPasswordReset: jest.fn().mockResolvedValue(undefined)
  };

  it('rejects invalid registration payloads', async () => {
    const response = await request(appFor(service))
      .post('/api/v1/auth/register')
      .send({ email: 'invalid' })
      .expect(422);
    expect(response.body.error.code).toBe('REQUEST_ERROR');
  });

  it('returns an access token and an HttpOnly refresh cookie on login', async () => {
    const response = await request(appFor(service))
      .post('/api/v1/auth/login')
      .send({ email: 'ada@example.com', password: 'password' })
      .expect(200);
    expect(response.body.data.accessToken).toBe('access-token');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  it('does not reveal whether an account exists when requesting a password reset', async () => {
    await request(appFor(service))
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'ada@example.com' })
      .expect(202);
    expect(service.requestPasswordReset).toHaveBeenCalledWith('ada@example.com');
  });
});
