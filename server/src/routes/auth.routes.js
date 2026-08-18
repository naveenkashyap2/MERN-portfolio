const { Router } = require('express');
const ctl = require('../controllers/auth.controller');
const { authRequired } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimits');

const router = Router();

router.post('/register', authLimiter, ctl.register);
router.post('/login', authLimiter, ctl.login);
router.post('/google', authLimiter, ctl.google);
router.post('/refresh', ctl.refresh);
router.post('/logout', ctl.logout);
router.post('/forgot-password', authLimiter, ctl.forgot);
router.post('/reset-password', authLimiter, ctl.reset);
router.post('/verify-email', ctl.verify);
router.get('/me', authRequired, ctl.me);

module.exports = router;
