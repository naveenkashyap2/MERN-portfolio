import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haversineMeters, walkingMinutes, formatDurationMinutes, formatKm } from '../src/utils/distance.js';

test('haversine: Delhi → Agra is roughly 180-190 km', () => {
  const m = haversineMeters(28.6139, 77.209, 27.1767, 78.0081);
  assert.ok(m > 175000 && m < 195000, `expected ~183km, got ${Math.round(m / 1000)}km`);
});

test('haversine: same point is 0', () => {
  assert.equal(haversineMeters(10, 10, 10, 10), 0);
});

test('walkingMinutes scales with distance', () => {
  const mins = walkingMinutes(4500); // 4.5 km at 4.5 km/h
  assert.equal(mins, 60);
});

test('formatDurationMinutes formats hours and minutes', () => {
  assert.equal(formatDurationMinutes(90), '1h 30m');
  assert.equal(formatDurationMinutes(45), '45 min');
});

test('formatKm formats meters and kilometers', () => {
  assert.equal(formatKm(800), '800 m');
  assert.equal(formatKm(4200), '4.2 km');
});
