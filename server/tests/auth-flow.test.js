const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri('subsense-test');

  const app = require('../index');

  const registerResult = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

  assert.equal(registerResult.status, 201, 'Expected successful registration');
  assert.ok(registerResult.body.user, 'Expected user payload on registration');

  const duplicateResult = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Another User',
      email: 'test@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

  assert.equal(duplicateResult.status, 409, 'Expected duplicate registration to be rejected');

  const loginResult = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'secret123',
    });

  assert.equal(loginResult.status, 200, 'Expected successful login');
  assert.ok(loginResult.body.token, 'Expected JWT token on login');

  const protectedResult = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${loginResult.body.token}`);

  assert.equal(protectedResult.status, 200, 'Expected authenticated request to succeed');
  assert.equal(protectedResult.body.user.email, 'test@example.com', 'Expected the correct user from token');

  const invalidTokenResult = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer invalid-token');

  assert.equal(invalidTokenResult.status, 401, 'Expected invalid token to be rejected');

  const noTokenResult = await request(app).get('/api/auth/me');

  assert.equal(noTokenResult.status, 401, 'Expected missing token to be rejected');

  const wrongPasswordResult = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'wrongpass',
    });

  assert.equal(wrongPasswordResult.status, 401, 'Expected wrong password to be rejected');

  const invalidEmailResult = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Bad User',
      email: 'bad-email',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

  assert.equal(invalidEmailResult.status, 400, 'Expected invalid email to be rejected');

  const storedUserCount = await User.countDocuments();
  assert.equal(storedUserCount, 1, 'Expected one stored user after valid flows');

  console.log('Auth flow test passed');

  await mongoose.disconnect();
  await mongoServer.stop();
})().catch((error) => {
  console.error('Auth flow test failed');
  console.error(error);
  process.exit(1);
});
