import { Router } from 'express';
import * as ctrl from '../controllers/transport.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(optionalAuth);

router.get('/compare', ctrl.compare);
router.get('/local', ctrl.localModes);

router.get('/trains/search', ctrl.searchTrains);
router.get('/trains/availability', ctrl.trainAvailability);
router.get('/trains/:trainId', ctrl.getTrain);
router.get('/trains/:trainId/schedule', ctrl.trainSchedule);

router.get('/buses/search', ctrl.searchBuses);
router.get('/buses/availability', ctrl.busAvailability);
router.get('/buses/:busId', ctrl.getBus);
router.get('/buses/:busId/schedule', ctrl.busSchedule);

export default router;
