import { Router } from 'express';
import * as ctrl from '../controllers/favorite.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/check/:placeId', ctrl.check);
router.delete('/:favoriteId', ctrl.remove);

export default router;
