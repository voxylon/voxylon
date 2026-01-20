// Load environment variables before anything else
require('dotenv').config();

process.env.USE_STATIC_DATA = 'true';

const request = require('supertest');
const app = require('../../src/server/app');

describe('server', () => {
  it('responds with health payload', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('serves the built client index page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<div id="root"></div>');
  });

  it('returns static registration count', async () => {
    const response = await request(app).get('/api/registrations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(typeof response.body.total).toBe('number');
  });

  it('rejects registration attempts', async () => {
    const response = await request(app)
      .post('/api/registrations')
      .send({ address: '0x123', validatorKey: '0x456', signature: '0x789' });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain('closed');
  });
});
