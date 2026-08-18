const { Router } = require('express');
const ctl = require('../controllers/trip.controller');
const { authRequired } = require('../middleware/auth');

const router = Router();

router.get('/:tripId/share/:shareToken', ctl.shared);

router.use(authRequired);
router.post('/', ctl.create);
router.get('/', ctl.list);
router.get('/:tripId', ctl.get);
router.patch('/:tripId', ctl.update);
router.delete('/:tripId', ctl.remove);
router.post('/:tripId/duplicate', ctl.duplicate);
router.post('/:tripId/share', ctl.share);

router.get('/:tripId/itinerary', ctl.itinerary);
router.post('/:tripId/itinerary', ctl.addItem);
router.post('/:tripId/itinerary/reorder', ctl.reorder);
router.get('/:tripId/itinerary/day/:day', ctl.day);
router.patch('/:tripId/itinerary/:itemId', ctl.updateItem);
router.delete('/:tripId/itinerary/:itemId', ctl.deleteItem);

router.get('/:tripId/expenses/summary', ctl.expenseSummary);
router.post('/:tripId/expenses', ctl.addExpense);
router.get('/:tripId/expenses', ctl.listExpenses);
router.get('/:tripId/expenses/:expenseId', ctl.getExpense);
router.patch('/:tripId/expenses/:expenseId', ctl.updateExpense);
router.delete('/:tripId/expenses/:expenseId', ctl.deleteExpense);

module.exports = router;
