const { Router } = require('express');
const ctl = require('../controllers/ai.controller');
const { authRequired } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimits');

const router = Router();
router.use(authRequired);
router.post('/chat', aiLimiter, ctl.chat);
router.get('/conversations', ctl.convos);
router.post('/conversations', ctl.createConvo);
router.get('/conversations/:conversationId', ctl.getConvo);
router.delete('/conversations/:conversationId', ctl.deleteConvo);
router.post('/replan', aiLimiter, ctl.assistantReplan);

module.exports = router;
