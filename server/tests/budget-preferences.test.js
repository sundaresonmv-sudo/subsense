const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri('subsense-budget-test');

  const app = require('../index');

  console.log('--- Setting up test user for budget & preferences ---');
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Budget Test User',
      email: 'budgetuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

  assert.equal(regRes.status, 201, 'Registration should return 201');
  const token = regRes.body.token;

  console.log('--- 1. Testing Default Budget Fetch ---');
  const getBudgetRes = await request(app)
    .get('/api/budget')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(getBudgetRes.status, 200, 'GET /api/budget should return 200');
  assert.equal(getBudgetRes.body.data.monthlyCap, 320, 'Default monthly cap should be 320');
  assert.ok(Array.isArray(getBudgetRes.body.data.categoryCaps), 'categoryCaps should be an array');

  console.log('--- 2. Testing Budget Update ---');
  const putBudgetRes = await request(app)
    .put('/api/budget')
    .set('Authorization', `Bearer ${token}`)
    .send({
      monthlyCap: 450.0,
      categoryCaps: [
        { category: 'Cloud Services', cap: 100.0 },
        { category: 'Development', cap: 80.0 },
      ],
    });

  assert.equal(putBudgetRes.status, 200, 'PUT /api/budget should return 200');
  assert.equal(putBudgetRes.body.data.monthlyCap, 450, 'Updated monthlyCap should be 450');
  assert.equal(putBudgetRes.body.data.categoryCaps.length, 2, 'Should have 2 updated category caps');

  console.log('--- 3. Testing User Preferences Update & Fetch ---');
  const putPrefRes = await request(app)
    .put('/api/auth/preferences')
    .set('Authorization', `Bearer ${token}`)
    .send({
      currency: 'EUR',
      defaultCycle: 'Yearly',
      emailAlerts: false,
      budgetAlerts: true,
    });

  assert.equal(putPrefRes.status, 200, 'PUT /api/auth/preferences should return 200');
  assert.equal(putPrefRes.body.user.currency, 'EUR', 'Currency should be updated to EUR');
  assert.equal(putPrefRes.body.user.defaultCycle, 'Yearly', 'Default cycle should be Yearly');
  assert.equal(putPrefRes.body.user.emailAlerts, false, 'Email alerts should be false');

  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(meRes.status, 200, 'GET /api/auth/me should return 200');
  assert.equal(meRes.body.user.currency, 'EUR', 'Fetched user should have EUR currency');

  console.log('--- Budget and preferences tests passed successfully! ---');

  await mongoose.disconnect();
  await mongoServer.stop();
})().catch((err) => {
  console.error('Budget & preferences test failed', err);
  process.exit(1);
});
