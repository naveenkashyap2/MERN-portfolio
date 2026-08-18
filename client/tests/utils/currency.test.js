import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inr } from '../../src/utils/currency.js';

describe('currency', () => {
  it('formats INR', () => {
    assert.match(inr(5000), /5,000/);
  });
});
