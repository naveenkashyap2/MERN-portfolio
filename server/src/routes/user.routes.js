const { Router } = require('express');
const ctl = require('../controllers/user.controller');
const { authRequired } = require('../middleware/auth');
const { avatarUpload } = require('../middleware/upload');

const router = Router();
router.use(authRequired);
router.get('/me', ctl.me);
router.patch('/me', ctl.update);
router.delete('/me', ctl.remove);
router.get('/me/preferences', ctl.prefs);
router.patch('/me/preferences', ctl.updatePrefs);
router.patch('/me/avatar', avatarUpload, ctl.avatar);

module.exports = router;
