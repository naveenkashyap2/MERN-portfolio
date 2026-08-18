import { Router } from 'express';
import * as ctrl from '../controllers/location.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { locationPointSchema, startSessionSchema, stopSessionSchema } from '../validators/location.validator.js';
import { locationLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/start', validate({ body: startSessionSchema }), ctrl.start);
router.post('/update', locationLimiter, validate({ body: locationPointSchema }), ctrl.update);
router.post('/stop', validate({ body: stopSessionSchema }), ctrl.stop);
router.get('/current', ctrl.current);
router.get('/history', ctrl.history);
router.delete('/history', ctrl.deleteHistory);
router.get('/distance', ctrl.distance);
router.get('/arrival-status', ctrl.arrivalStatus);

export default router;
