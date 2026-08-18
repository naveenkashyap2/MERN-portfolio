import { Router } from 'express';
import * as ctrl from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.list);
router.patch('/read-all', ctrl.markAllRead);
router.patch('/:notificationId/read', ctrl.markRead);
router.delete('/:notificationId', ctrl.remove);

export default router;
