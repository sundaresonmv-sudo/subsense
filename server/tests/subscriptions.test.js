const assert = require('node:assert/strict');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri('subsense-subscriptions-test');

  const app = require('../index');
  const { Subscription } = require('../models/Subscription');

  console.log('--- Setting up test users ---');

  // Register User 1
  const resUser1 = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  assert.equal(resUser1.status, 201, 'User 1 registration should return 201');
  const tokenUser1 = resUser1.body.token;
  const user1Id = resUser1.body.user.id;

  // Register User 2
  const resUser2 = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  assert.equal(resUser2.status, 201, 'User 2 registration should return 201');
  const tokenUser2 = resUser2.body.token;
  const user2Id = resUser2.body.user.id;

  console.log('--- 1. Testing Unauthorized Access ---');

  // No token
  const noTokenGet = await request(app).get('/api/subscriptions');
  assert.equal(noTokenGet.status, 401, 'Expected 401 when no token is provided to GET /api/subscriptions');

  const noTokenPost = await request(app).post('/api/subscriptions').send({});
  assert.equal(noTokenPost.status, 401, 'Expected 401 when no token is provided to POST /api/subscriptions');

  const noTokenGetById = await request(app).get('/api/subscriptions/507f1f77bcf86cd799439011');
  assert.equal(noTokenGetById.status, 401, 'Expected 401 when no token is provided to GET /api/subscriptions/:id');

  const noTokenPut = await request(app).put('/api/subscriptions/507f1f77bcf86cd799439011').send({});
  assert.equal(noTokenPut.status, 401, 'Expected 401 when no token is provided to PUT /api/subscriptions/:id');

  const noTokenDelete = await request(app).delete('/api/subscriptions/507f1f77bcf86cd799439011');
  assert.equal(noTokenDelete.status, 401, 'Expected 401 when no token is provided to DELETE /api/subscriptions/:id');

  // Invalid token
  const invalidTokenGet = await request(app)
    .get('/api/subscriptions')
    .set('Authorization', 'Bearer invalid-token');
  assert.equal(invalidTokenGet.status, 401, 'Expected 401 when invalid token is provided');

  console.log('--- 2. Testing Validation on Creation ---');

  // Missing serviceName
  const missingNameRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(missingNameRes.status, 400, 'Expected 400 for missing serviceName');

  // Empty serviceName
  const emptyNameRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: '   ',
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(emptyNameRes.status, 400, 'Expected 400 for whitespace-only serviceName');

  // Missing price
  const missingPriceRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(missingPriceRes.status, 400, 'Expected 400 for missing price');

  // Invalid price: zero or negative
  const zeroPriceRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 0,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(zeroPriceRes.status, 400, 'Expected 400 for zero price');

  const negPriceRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: -12.5,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(negPriceRes.status, 400, 'Expected 400 for negative price');

  const nonNumericPriceRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 'abc',
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(nonNumericPriceRes.status, 400, 'Expected 400 for non-numeric price');

  // Missing / Invalid category
  const missingCategoryRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(missingCategoryRes.status, 400, 'Expected 400 for missing category');

  const invalidCategoryRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Gaming',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
    });
  assert.equal(invalidCategoryRes.status, 400, 'Expected 400 for invalid category');

  // Missing / Invalid billingCycle
  const missingBillingCycleRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 15.99,
      renewalDate: '2026-10-01',
    });
  assert.equal(missingBillingCycleRes.status, 400, 'Expected 400 for missing billingCycle');

  const invalidBillingCycleRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Daily',
      renewalDate: '2026-10-01',
    });
  assert.equal(invalidBillingCycleRes.status, 400, 'Expected 400 for invalid billingCycle');

  // Missing / Invalid renewalDate
  const missingRenewalDateRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Monthly',
    });
  assert.equal(missingRenewalDateRes.status, 400, 'Expected 400 for missing renewalDate');

  const invalidRenewalDateRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: 'not-a-valid-date',
    });
  assert.equal(invalidRenewalDateRes.status, 400, 'Expected 400 for invalid renewalDate');

  // Invalid status
  const invalidStatusRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix',
      category: 'Entertainment',
      price: 15.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-01',
      status: 'Archived',
    });
  assert.equal(invalidStatusRes.status, 400, 'Expected 400 for invalid status');

  // Invalid ID format
  const invalidIdRes = await request(app)
    .get('/api/subscriptions/123-not-an-id')
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(invalidIdRes.status, 400, 'Expected 400 for invalid ObjectId format');

  console.log('--- 3. Testing CRUD Operations for User 1 ---');

  // Create Subscription 1 (Netflix)
  const createSub1Res = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'Netflix Standard',
      category: 'Entertainment',
      price: 15.99,
      currency: 'USD',
      billingCycle: 'Monthly',
      startDate: '2026-01-01',
      renewalDate: '2026-10-01',
      status: 'Active',
      notes: 'Premium 4K streaming plan',
    });
  assert.equal(createSub1Res.status, 201, 'Expected 201 for valid subscription creation');
  assert.ok(createSub1Res.body.data._id, 'Expected returned subscription to have _id');
  assert.equal(createSub1Res.body.data.serviceName, 'Netflix Standard');
  assert.equal(createSub1Res.body.data.userId, user1Id, 'Subscription must belong to User 1');
  const sub1Id = createSub1Res.body.data._id;

  // Create Subscription 2 (GitHub Copilot)
  const createSub2Res = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      serviceName: 'GitHub Copilot',
      category: 'Development',
      price: 10.0,
      currency: 'USD',
      billingCycle: 'Monthly',
      renewalDate: '2026-10-15',
    });
  assert.equal(createSub2Res.status, 201, 'Expected 201 for Copilot creation');
  const sub2Id = createSub2Res.body.data._id;

  // Read all subscriptions for User 1
  const getAllRes1 = await request(app)
    .get('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(getAllRes1.status, 200, 'Expected 200 for fetching subscriptions');
  assert.equal(getAllRes1.body.count, 2, 'Expected 2 subscriptions for User 1');
  assert.equal(getAllRes1.body.data.length, 2);

  // Read Subscription 1 by ID
  const getSub1Res = await request(app)
    .get(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(getSub1Res.status, 200, 'Expected 200 for fetching single subscription');
  assert.equal(getSub1Res.body.data.serviceName, 'Netflix Standard');

  // Update Subscription 1
  const updateSub1Res = await request(app)
    .put(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({
      price: 19.99,
      status: 'Paused',
      notes: 'Paused for the summer',
    });
  assert.equal(updateSub1Res.status, 200, 'Expected 200 on successful update');
  assert.equal(updateSub1Res.body.data.price, 19.99);
  assert.equal(updateSub1Res.body.data.status, 'Paused');
  assert.equal(updateSub1Res.body.data.notes, 'Paused for the summer');

  // Delete Subscription 2
  const deleteSub2Res = await request(app)
    .delete(`/api/subscriptions/${sub2Id}`)
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(deleteSub2Res.status, 200, 'Expected 200 on successful deletion');

  // Verify User 1 now has only 1 subscription
  const getAllResAfterDelete = await request(app)
    .get('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(getAllResAfterDelete.body.count, 1, 'Expected 1 subscription remaining');
  assert.equal(getAllResAfterDelete.body.data[0]._id, sub1Id);

  console.log('--- 4. Testing Tenancy, Cross-User Isolation & Security ---');

  // User 2 creates Subscription 3 (Spotify)
  const createSub3Res = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser2}`)
    .send({
      serviceName: 'Spotify Family',
      category: 'Entertainment',
      price: 16.99,
      billingCycle: 'Monthly',
      renewalDate: '2026-11-01',
    });
  assert.equal(createSub3Res.status, 201, 'Expected 201 for User 2 subscription');
  const sub3Id = createSub3Res.body.data._id;

  // User 2 fetches all subscriptions -> only receives Spotify
  const getAllRes2 = await request(app)
    .get('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser2}`);
  assert.equal(getAllRes2.body.count, 1, 'User 2 should only see 1 subscription');
  assert.equal(getAllRes2.body.data[0]._id, sub3Id, 'User 2 should only see Spotify');

  // User 2 attempts to read User 1's subscription (sub1Id) -> 403 Forbidden
  const crossUserGet = await request(app)
    .get(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser2}`);
  assert.equal(crossUserGet.status, 403, 'Expected 403 when User 2 accesses User 1 subscription');

  // User 2 attempts to update User 1's subscription -> 403 Forbidden
  const crossUserPut = await request(app)
    .put(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser2}`)
    .send({ price: 1.0 });
  assert.equal(crossUserPut.status, 403, 'Expected 403 when User 2 updates User 1 subscription');

  // User 2 attempts to delete User 1's subscription -> 403 Forbidden
  const crossUserDelete = await request(app)
    .delete(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser2}`);
  assert.equal(crossUserDelete.status, 403, 'Expected 403 when User 2 deletes User 1 subscription');

  // Verify User 1's subscription remains intact
  const verifySub1Intact = await request(app)
    .get(`/api/subscriptions/${sub1Id}`)
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(verifySub1Intact.status, 200);
  assert.equal(verifySub1Intact.body.data.price, 19.99);

  // Security: Attempt to spoof userId in POST body
  const spoofCreateRes = await request(app)
    .post('/api/subscriptions')
    .set('Authorization', `Bearer ${tokenUser2}`)
    .send({
      userId: user1Id, // attempting to impersonate User 1
      serviceName: 'Figma Pro',
      category: 'Design',
      price: 12.0,
      billingCycle: 'Monthly',
      renewalDate: '2026-10-20',
    });
  assert.equal(spoofCreateRes.status, 201);
  assert.equal(
    spoofCreateRes.body.data.userId,
    user2Id,
    'Server must ignore client-provided userId and enforce req.user._id'
  );

  // Security: Attempt to modify userId in PUT body
  const spoofPutRes = await request(app)
    .put(`/api/subscriptions/${sub3Id}`)
    .set('Authorization', `Bearer ${tokenUser2}`)
    .send({
      userId: user1Id, // attempting to reassign subscription to User 1
      price: 18.99,
    });
  assert.equal(spoofPutRes.status, 200);
  const updatedSub3 = await Subscription.findById(sub3Id);
  assert.equal(
    updatedSub3.userId.toString(),
    user2Id,
    'Server must prevent updating userId on existing subscription'
  );

  console.log('--- 5. Testing Non-Existent Resources (404) ---');

  const nonExistentId = new mongoose.Types.ObjectId().toString();

  const getNonExistent = await request(app)
    .get(`/api/subscriptions/${nonExistentId}`)
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(getNonExistent.status, 404, 'Expected 404 for non-existent subscription on GET');

  const putNonExistent = await request(app)
    .put(`/api/subscriptions/${nonExistentId}`)
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({ price: 25.0 });
  assert.equal(putNonExistent.status, 404, 'Expected 404 for non-existent subscription on PUT');

  const deleteNonExistent = await request(app)
    .delete(`/api/subscriptions/${nonExistentId}`)
    .set('Authorization', `Bearer ${tokenUser1}`);
  assert.equal(deleteNonExistent.status, 404, 'Expected 404 for non-existent subscription on DELETE');

  console.log('--- All Subscription tests passed successfully! ---');

  await mongoose.disconnect();
  await mongoServer.stop();
})().catch((error) => {
  console.error('Subscription test suite failed:');
  console.error(error);
  process.exit(1);
});
