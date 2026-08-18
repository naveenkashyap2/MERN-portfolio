import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { newId } from '../store/memory.js';
import { assertOwnership } from '../middleware/auth.middleware.js';

function getTrip(req) {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  return trip;
}

/** POST /api/v1/trips/:tripId/expenses */
export const create = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expense = {
    id: newId('exp'),
    userId: req.user.id,
    tripId: trip.id,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description || '',
    date: req.body.date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.expenses.insert(expense);
  return created(res, { expense });
});

/** GET /api/v1/trips/:tripId/expenses */
export const list = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expenses = store.expenses
    .filter((e) => e.tripId === trip.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return ok(res, { expenses, total: expenses.reduce((a, e) => a + e.amount, 0) });
});

/** GET /api/v1/trips/:tripId/expenses/:expenseId */
export const getOne = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expense = store.expenses.find((e) => e.id === req.params.expenseId && e.tripId === trip.id);
  if (!expense) throw ApiError.notFound('Expense not found.');
  return ok(res, { expense });
});

/** PATCH /api/v1/trips/:tripId/expenses/:expenseId */
export const update = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expense = store.expenses.find((e) => e.id === req.params.expenseId && e.tripId === trip.id);
  if (!expense) throw ApiError.notFound('Expense not found.');
  const updated = store.expenses.update(expense.id, { ...req.body, updatedAt: new Date().toISOString() });
  return ok(res, { expense: updated });
});

/** DELETE /api/v1/trips/:tripId/expenses/:expenseId */
export const remove = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expense = store.expenses.find((e) => e.id === req.params.expenseId && e.tripId === trip.id);
  if (!expense) throw ApiError.notFound('Expense not found.');
  store.expenses.remove(expense.id);
  return ok(res, { message: 'Expense deleted.' });
});

/** GET /api/v1/trips/:tripId/expenses/summary */
export const summary = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const expenses = store.expenses.filter((e) => e.tripId === trip.id);
  const categories = ['transport', 'hotel', 'food', 'shopping', 'activities', 'other'];
  const byCategory = {};
  for (const c of categories) byCategory[c] = 0;
  for (const e of expenses) byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;

  const spent = expenses.reduce((a, e) => a + e.amount, 0);
  const budget = trip.budget || 0;
  const remaining = Math.max(0, budget - spent);

  return ok(res, {
    budget,
    spent,
    remaining,
    byCategory,
    warning: budget > 0 && spent / budget >= 0.8 ? "You're close to your budget." : null,
    percentUsed: budget > 0 ? Math.round((spent / budget) * 100) : 0,
  });
});
