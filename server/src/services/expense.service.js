const Expense = require('../models/Expense');
const { EXPENSE_CATEGORIES } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { assert, objectId, rejectUnknown } = require('../utils/validate');
const { paginate, pageResult } = require('../utils/pagination');
const { loadOwnedTrip } = require('./trip.service');

async function addExpense(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  rejectUnknown(req.body, ['amount', 'category', 'description', 'date']);
  const amount = Number(req.body.amount);
  assert(Number.isFinite(amount) && amount >= 0, 'Enter a valid amount.');
  assert(EXPENSE_CATEGORIES.includes(req.body.category), 'Invalid category.');
  const expense = await Expense.create({
    userId: req.user._id,
    tripId: trip._id,
    amount,
    category: req.body.category,
    description: String(req.body.description || '').slice(0, 240),
    date: req.body.date ? new Date(req.body.date) : new Date(),
  });
  return { expense };
}

async function listExpenses(req) {
  await loadOwnedTrip(req, req.params.tripId);
  const { page, limit, skip } = paginate(req.query);
  const filter = { tripId: req.params.tripId, userId: req.user._id };
  const [items, total] = await Promise.all([
    Expense.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    Expense.countDocuments(filter),
  ]);
  return pageResult(items, total, page, limit);
}

async function getExpense(req) {
  await loadOwnedTrip(req, req.params.tripId);
  objectId(req.params.expenseId, 'expenseId');
  const expense = await Expense.findOne({
    _id: req.params.expenseId,
    tripId: req.params.tripId,
    userId: req.user._id,
  });
  if (!expense) throw new ApiError(404, 'Expense not found.', { code: 'NOT_FOUND' });
  return { expense };
}

async function updateExpense(req) {
  const { expense } = await getExpense(req);
  rejectUnknown(req.body, ['amount', 'category', 'description', 'date']);
  if (req.body.amount !== undefined) {
    const amount = Number(req.body.amount);
    assert(Number.isFinite(amount) && amount >= 0, 'Enter a valid amount.');
    expense.amount = amount;
  }
  if (req.body.category) {
    assert(EXPENSE_CATEGORIES.includes(req.body.category), 'Invalid category.');
    expense.category = req.body.category;
  }
  if (req.body.description !== undefined) expense.description = String(req.body.description).slice(0, 240);
  if (req.body.date) expense.date = new Date(req.body.date);
  await expense.save();
  return { expense };
}

async function deleteExpense(req) {
  const { expense } = await getExpense(req);
  await expense.deleteOne();
  return { ok: true };
}

async function summary(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  const rows = await Expense.aggregate([
    { $match: { tripId: trip._id, userId: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  const byCategory = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0]));
  let spent = 0;
  rows.forEach((r) => {
    byCategory[r._id] = r.total;
    spent += r.total;
  });
  const remaining = trip.budget - spent;
  return {
    budget: trip.budget,
    spent,
    remaining,
    byCategory,
    warning: remaining <= trip.budget * 0.15 && trip.budget > 0,
  };
}

module.exports = { addExpense, listExpenses, getExpense, updateExpense, deleteExpense, summary };
