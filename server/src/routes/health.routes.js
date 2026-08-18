import { Router } from 'express';
import * as ctrl from '../controllers/health.controller.js';

const router = Router();

router.get('/', ctrl.health);
router.get('/database', ctrl.database);
router.get('/services', ctrl.services);

export default router;
