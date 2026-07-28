import request from 'supertest';
import { createApp } from '../../app.js';

describe('GET /api/v1/health', () => {
  it('returns the API health payload', async () => {
    const response = await request(createApp()).get('/api/v1/health').expect(200);

    expect(response.body.data).toMatchObject({ status: 'ok', service: 'secure-login-portal-api' });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });
});
