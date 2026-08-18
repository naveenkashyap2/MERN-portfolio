import { Router } from 'express';
import * as ctrl from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/me', ctrl.getMe);
router.patch('/me', ctrl.updateMe);
router.delete('/me', ctrl.deleteMe);
router.patch('/me/avatar', ctrl.updateAvatar);
router.get('/me/preferences', ctrl.getPreferences);
router.patch('/me/preferences', ctrl.updatePreferences);

export default router;
