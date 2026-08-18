const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { stripMongo } = require('../../src/utils/sanitize');

describe('security helpers', () => {
  it('strips operator injection', () => {
    const clean = stripMongo({ email: { $gt: '' }, name: 'A' });
    assert.equal(Object.keys(clean.email || {}).length, 0);
    assert.equal(clean.name, 'A');
  });
});
