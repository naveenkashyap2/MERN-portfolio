const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { extractJson } = require('../../src/providers/gemini/geminiProvider');
const { validatePlan } = require('../../src/services/aiPlanValidator');
const { parseNaturalLanguage } = require('../../src/utils/nlTrip');

describe('ai parser', () => {
  it('extracts fenced json', () => {
    const data = extractJson('```json\n{"destination":"Agra"}\n```');
    assert.equal(data.destination, 'Agra');
  });

  it('sanitizes invented coordinates', () => {
    const plan = validatePlan(
      {
        destination: 'Agra',
        duration: 2,
        budget: 5000,
        days: [
          {
            day: 1,
            items: [
              {
                title: 'Secret bunker',
                lat: 1,
                lng: 2,
                coordinatesVerified: true,
                startTime: '09:00',
                endTime: '10:00',
              },
            ],
          },
        ],
      },
      { destination: 'Agra', durationDays: 2, budget: 5000, stayPreference: 'medium', transportPreference: 'train' }
    );
    assert.equal(plan.itinerary[0].lat, null);
    assert.equal(plan.itinerary[0].coordinatesVerified, false);
    assert.equal(plan.itinerary[0].trust, 'AI ESTIMATE');
  });

  it('parses hinglish intent', () => {
    const parsed = parseNaturalLanguage(
      'Delhi se Agra 2 din ke liye jana hai, budget 5000 hai, train se jana hai, Taj Mahal aur temples.'
    );
    assert.equal(parsed.origin.toLowerCase().includes('delhi'), true);
    assert.equal(parsed.destination.toLowerCase().includes('agra'), true);
    assert.equal(parsed.budget, 5000);
    assert.equal(parsed.durationDays, 2);
    assert.equal(parsed.transportPreference, 'train');
  });
});
