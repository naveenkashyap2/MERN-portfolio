const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { haversineKm, walkingEtaMinutes, inRadius } = require('../../src/utils/distance');

describe('distance', () => {
  it('computes Delhi to Agra roughly 180-210 km', () => {
    const km = haversineKm({ lat: 28.6139, lng: 77.209 }, { lat: 27.1767, lng: 78.0081 });
    assert.ok(km > 170 && km < 220, km);
  });

  it('walking eta for 10.2 km is about 2 hours', () => {
    const mins = walkingEtaMinutes(10.2);
    assert.ok(mins > 110 && mins < 140, mins);
  });

  it('arrival radius works', () => {
    const here = { lat: 28.6129, lng: 77.2295 };
    assert.equal(inRadius(here, { lat: 28.6129, lng: 77.2295 }, 50), true);
    assert.equal(inRadius(here, { lat: 28.6315, lng: 77.2167 }, 50), false);
  });
});
