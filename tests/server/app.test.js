// Load environment variables before anything else
require('dotenv').config();

const request = require('supertest');
const { Wallet } = require('ethers');
const { buildRegistrationMessage } = require('../../src/common/validation');
const app = require('../../src/server/app');

// For tests, we'll use a test Supabase instance
// Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or .env.test.local

// Import db after setting up environment
const { db, supabase } = require('../../src/common/supabase');

const truncateRegistrations = async () => {
  // Delete all test registrations
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .neq('address', '__IMPOSSIBLE__'); // Delete all rows
    
    if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
      console.error('Error truncating registrations:', error);
    }
  } catch (err) {
    console.error('Failed to truncate:', err);
  }
};

describe('server', () => {
  beforeEach(async () => {
    await truncateRegistrations();
  });

  afterAll(async () => {
    await truncateRegistrations();
  });

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

  it('creates and retrieves a validator registration', async () => {
    const wallet = Wallet.createRandom();
    const validatorKey = `0x${'a'.repeat(96)}`;
    const message = buildRegistrationMessage(validatorKey);
    const signature = await wallet.signMessage(message);

    const emptyCountResponse = await request(app).get('/api/registrations');
    expect(emptyCountResponse.status).toBe(200);
    expect(emptyCountResponse.body.total).toBeGreaterThanOrEqual(0);

    const createResponse = await request(app)
      .post('/api/registrations')
      .send({ address: wallet.address, validatorKey, signature });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.address).toBe(wallet.address);
    expect(createResponse.body.validatorKey).toBe(validatorKey);
    expect(createResponse.body.isValid).toBe(true);

    const fetchResponse = await request(app).get(`/api/registrations/${wallet.address}`);
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.validatorKey).toBe(validatorKey);
    expect(fetchResponse.body.isValid).toBe(true);

    const countResponse = await request(app).get('/api/registrations');
    expect(countResponse.status).toBe(200);
    expect(countResponse.body.total).toBeGreaterThan(0);
  });

  it('rejects duplicate validator keys registered by another account', async () => {
    const walletOne = Wallet.createRandom();
    const walletTwo = Wallet.createRandom();
    const validatorKey = `0x${'b'.repeat(96)}`;

    const messageOne = buildRegistrationMessage(validatorKey);
    const signatureOne = await walletOne.signMessage(messageOne);

    await request(app)
      .post('/api/registrations')
      .send({ address: walletOne.address, validatorKey, signature: signatureOne })
      .expect(201);

    const messageTwo = buildRegistrationMessage(validatorKey);
    const signatureTwo = await walletTwo.signMessage(messageTwo);

    const response = await request(app)
      .post('/api/registrations')
      .send({ address: walletTwo.address, validatorKey, signature: signatureTwo });

    expect(response.status).toBe(409);
  });

  it('blocks re-registration attempts from the same account', async () => {
    const wallet = Wallet.createRandom();
    const validatorKeyOne = `0x${'d'.repeat(96)}`;
    const validatorKeyTwo = `0x${'e'.repeat(96)}`;

    const messageOne = buildRegistrationMessage(validatorKeyOne);
    const signatureOne = await wallet.signMessage(messageOne);

    await request(app)
      .post('/api/registrations')
      .send({ address: wallet.address, validatorKey: validatorKeyOne, signature: signatureOne })
      .expect(201);

    const messageTwo = buildRegistrationMessage(validatorKeyTwo);
    const signatureTwo = await wallet.signMessage(messageTwo);

    const response = await request(app)
      .post('/api/registrations')
      .send({ address: wallet.address, validatorKey: validatorKeyTwo, signature: signatureTwo });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already exists/i);
  });

  it('blocks invalid signatures', async () => {
    const wallet = Wallet.createRandom();
    const validatorKey = `0x${'c'.repeat(96)}`;
    const badSignature = `0x${'0'.repeat(130)}`;

    const response = await request(app)
      .post('/api/registrations')
      .send({ address: wallet.address, validatorKey, signature: badSignature });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
  });
});
