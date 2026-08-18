const { Router } = require('express');
const ctl = require('../controllers/ai.controller');
const { authRequired } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimits');

const router = Router();
router.use(authRequired, aiLimiter);
router.post('/trip/generate', ctl.generate);
router.post('/trip/regenerate', ctl.regenerate);
router.post('/trip/optimize', ctl.optimize);
router.post('/trip/replan', ctl.replan);
router.post('/trip/budget-optimize', ctl.budget);
router.post('/trip/route-optimize', ctl.route);
router.post('/trip/suggest', ctl.suggest);

module.exports = router;
