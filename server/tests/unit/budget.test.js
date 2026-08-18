const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildTemplatePlan, optimizeBudget } = require('../../src/services/templatePlanner');

describe('budget', () => {
  it('builds a catalog itinerary for Agra', () => {
    const plan = buildTemplatePlan({
      origin: 'Delhi',
      destination: 'Agra',
      durationDays: 2,
      budget: 5000,
      travelers: { adults: 2, children: 0 },
      transportPreference: 'train',
      stayPreference: 'medium',
      interests: ['historical', 'temple', 'food'],
    });
    assert.ok(plan.itinerary.length > 4);
    assert.ok(plan.itinerary.some((i) => i.title.includes('Taj')));
    assert.ok(plan.itinerary.every((i) => i.trust === 'CATALOG' || i.trust === 'ESTIMATED'));
  });

  it('reduces stay estimate on budget optimize', () => {
    const plan = buildTemplatePlan({
      origin: 'Delhi',
      destination: 'Agra',
      durationDays: 2,
      budget: 5000,
      travelers: { adults: 2 },
      stayPreference: 'medium',
      interests: ['historical'],
    });
    const next = optimizeBudget(plan, 3500);
    assert.equal(next.budget, 3500);
    if (next.hotels[0] && plan.hotels[0]) {
      assert.ok(next.hotels[0].estimatedPrice <= plan.hotels[0].estimatedPrice);
    }
  });
});
