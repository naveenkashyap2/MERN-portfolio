const { asyncHandler } = require('../utils/asyncHandler');
const { ok, created } = require('../utils/ApiResponse');
const trips = require('../services/trip.service');
const itinerary = require('../services/itinerary.service');
const expenses = require('../services/expense.service');

module.exports = {
  create: asyncHandler(async (req, res) => created(res, await trips.createTrip(req), 'Trip created.')),
  list: asyncHandler(async (req, res) => ok(res, await trips.listTrips(req))),
  get: asyncHandler(async (req, res) => ok(res, await trips.getTrip(req))),
  update: asyncHandler(async (req, res) => ok(res, await trips.updateTrip(req), 'Trip updated successfully.')),
  remove: asyncHandler(async (req, res) => ok(res, await trips.deleteTrip(req), 'Trip deleted.')),
  duplicate: asyncHandler(async (req, res) => created(res, await trips.duplicateTrip(req), 'Trip duplicated.')),
  share: asyncHandler(async (req, res) => ok(res, await trips.shareTrip(req), 'Share settings updated.')),
  shared: asyncHandler(async (req, res) => ok(res, await trips.getSharedTrip(req))),
  itinerary: asyncHandler(async (req, res) => ok(res, await itinerary.listItinerary(req))),
  addItem: asyncHandler(async (req, res) => created(res, await itinerary.addItem(req))),
  updateItem: asyncHandler(async (req, res) => ok(res, await itinerary.updateItem(req))),
  deleteItem: asyncHandler(async (req, res) => ok(res, await itinerary.deleteItem(req))),
  reorder: asyncHandler(async (req, res) => ok(res, await itinerary.reorder(req), 'Your route has been updated.')),
  day: asyncHandler(async (req, res) => ok(res, await itinerary.byDay(req))),
  addExpense: asyncHandler(async (req, res) => created(res, await expenses.addExpense(req), 'Expense added.')),
  listExpenses: asyncHandler(async (req, res) => ok(res, await expenses.listExpenses(req))),
  getExpense: asyncHandler(async (req, res) => ok(res, await expenses.getExpense(req))),
  updateExpense: asyncHandler(async (req, res) => ok(res, await expenses.updateExpense(req))),
  deleteExpense: asyncHandler(async (req, res) => ok(res, await expenses.deleteExpense(req))),
  expenseSummary: asyncHandler(async (req, res) => ok(res, await expenses.summary(req))),
};
