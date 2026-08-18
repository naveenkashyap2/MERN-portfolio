const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validatePassword, hashPassword, verifyPassword } = require('../../src/utils/password');

describe('password', () => {
  it('rejects weak passwords', () => {
    assert.equal(validatePassword('secret').ok, false);
    assert.equal(validatePassword('Password1').ok, false);
  });

  it('accepts strong passwords', () => {
    assert.equal(validatePassword('Travel@123').ok, true);
  });

  it('hashes and verifies', async () => {
    const hash = await hashPassword('Travel@123');
    assert.equal(hash.includes('Travel@123'), false);
    assert.equal(await verifyPassword('Travel@123', hash), true);
    assert.equal(await verifyPassword('nope', hash), false);
  });
});
