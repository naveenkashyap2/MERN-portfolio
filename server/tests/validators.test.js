import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passwordSchema } from '../src/validators/auth.validator.js';
import { createExpenseSchema } from '../src/validators/expense.validator.js';

test('password: accepts a strong password', () => {
  assert.doesNotThrow(() => passwordSchema.parse('Str0ng!Pass'));
});

test('password: rejects a weak password', () => {
  assert.throws(() => passwordSchema.parse('password'), /uppercase/i);
  assert.throws(() => passwordSchema.parse('SHORT1!'), /at least 8/i);
});

test('expense: rejects negative amounts and unknown categories', () => {
  assert.throws(() => createExpenseSchema.parse({ amount: -5, category: 'food' }));
  assert.throws(() => createExpenseSchema.parse({ amount: 5, category: 'nope' }));
  assert.doesNotThrow(() => createExpenseSchema.parse({ amount: 500, category: 'food' }));
});
