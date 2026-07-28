import { jest } from '@jest/globals';
import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../middlewares/error-handler.js';
import { createUserRouter } from './user.routes.js';

function buildApp(service) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, _res, next) => {
    req.auth = { sub: 'user-1', roles: ['SUPER_ADMIN'] };
    next();
  });
  app.use('/api/v1/users', createUserRouter(service));
  app.use(errorHandler);
  return app;
}

describe('user routes', () => {
  it('returns the current profile', async () => {
    const service = {
      getUserProfile: jest.fn().mockResolvedValue({ user: { id: 'user-1', email: 'ada@example.com' } })
    };
    const response = await request(buildApp(service)).get('/api/v1/users/me').expect(200);
    expect(response.body.data.user.email).toBe('ada@example.com');
  });
});
