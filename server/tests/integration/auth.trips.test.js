const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { connectDb, disconnectDb } = require('../../src/config/db');
const { createApp } = require('../../src/app');

describe('auth + trips', () => {
  let app;

  before(async () => {
    process.env.USE_IN_MEMORY_DB = 'true';
    await connectDb();
    app = createApp();
  });

  after(async () => {
    await disconnectDb();
  });

  it('registers, creates a trip, and blocks IDOR', async () => {
    const agentA = request.agent(app);
    const agentB = request.agent(app);

    const regA = await agentA.post('/api/v1/auth/register').send({
      name: 'Naveen',
      email: 'naveen@example.com',
      password: 'Travel@123',
    });
    assert.equal(regA.status, 201);

    const regB = await agentB.post('/api/v1/auth/register').send({
      name: 'Other',
      email: 'other@example.com',
      password: 'Travel@123',
    });
    assert.equal(regB.status, 201);

    const created = await agentA.post('/api/v1/trips').send({
      origin: 'Delhi',
      destination: 'Agra',
      startDate: '2026-09-01',
      endDate: '2026-09-02',
      travelers: { adults: 2, children: 0 },
      budget: 5000,
      transportPreference: 'train',
      stayPreference: 'medium',
      interests: ['historical', 'temple', 'food'],
    });
    assert.equal(created.status, 201);
    const tripId = created.body.data.trip._id;

    const stolen = await agentB.get(`/api/v1/trips/${tripId}`);
    assert.ok(stolen.status === 404 || stolen.status === 403);

    const mine = await agentA.get(`/api/v1/trips/${tripId}`);
    assert.equal(mine.status, 200);
    assert.equal(mine.body.data.trip.destination.name, 'Agra');
  });

  it('does not invent live trains', async () => {
    const res = await request(app).get('/api/v1/transport/trains/search').query({ from: 'Delhi', to: 'Agra' });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.live, false);
    assert.match(res.body.data.message, /could not be verified/i);
  });
});
