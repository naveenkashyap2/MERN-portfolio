import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNaturalLanguage, normalizeCity, generateTrip } from '../src/services/ai.service.js';

test('normalizeCity maps aliases', () => {
  assert.equal(normalizeCity('dilli'), 'New Delhi');
  assert.equal(normalizeCity('banaras'), 'Varanasi');
  assert.equal(normalizeCity('Agra'), 'Agra');
});

test('parseNaturalLanguage extracts intent', () => {
  const p = parseNaturalLanguage('Delhi se Agra 2 din ke liye jana hai, budget 5000 hai, train se, Taj Mahal aur temples dekhne hain');
  assert.equal(p.destination, 'Agra');
  assert.equal(p.durationDays, 2);
  assert.equal(p.budget, 5000);
  assert.equal(p.transportPreference, 'train');
  assert.ok(p.interests.includes('historical') || p.interests.includes('temple'));
});

test('generateTrip (demo planner) returns a valid structured trip', async () => {
  const trip = await generateTrip({
    origin: 'Delhi',
    destination: 'Jaipur',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    travelers: { adults: 2, children: 0 },
    budget: 8000,
    transportPreference: 'train',
    stayPreference: 'medium',
    interests: ['historical', 'food'],
  });

  assert.ok(trip.itinerary.length >= 1);
  assert.ok(trip.itinerary[0].items.length >= 3);
  assert.ok(trip.budgetBreakdown.transport >= 0);
  assert.equal(trip.ai.generated, true);
});
