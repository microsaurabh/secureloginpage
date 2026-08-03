import request from 'supertest';
import { createApp } from '../../app.js';

describe('GET /api/v1/health', () => {
  it('returns the API health payload', async () => {
    const response = await request(createApp()).get('/api/v1/health').expect(200);

    expect(response.body.data).toMatchObject({ status: 'ok', service: 'secure-login-portal-api' });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it('returns a request identifier and CSRF token', async () => {
    const response = await request(createApp()).get('/api/v1/csrf-token').expect(200);

    expect(response.headers['x-request-id']).toEqual(expect.any(String));
    expect(response.headers['set-cookie'][0]).toContain('csrf_token=');
    expect(response.body.data.csrfToken).toEqual(expect.any(String));
  });

  it('rejects MongoDB query operators in requests', async () => {
    const response = await request(createApp())
      .post('/api/v1/auth/login')
      .send({ email: { $ne: '' }, password: 'password' })
      .expect(400);

    expect(response.body.error.code).toBe('INVALID_REQUEST_FIELD');
  });

  it('reports not ready until the database is connected', async () => {
    const response = await request(createApp()).get('/api/v1/health/ready').expect(503);

    expect(response.body.data.status).toBe('not_ready');
  });
});
