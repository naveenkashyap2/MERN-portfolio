import { Router } from 'express';
import * as ctrl from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createTripSchema, updateTripSchema } from '../validators/trip.validator.js';

const router = Router();
router.use(authenticate);

router.post('/', validate({ body: createTripSchema }), ctrl.createTrip);
router.get('/', ctrl.listTrips);
router.get('/:tripId', ctrl.getTrip);
router.patch('/:tripId', validate({ body: updateTripSchema }), ctrl.updateTrip);
router.delete('/:tripId', ctrl.deleteTrip);
router.post('/:tripId/duplicate', ctrl.duplicateTrip);
router.post('/:tripId/share', ctrl.shareTrip);
router.get('/:tripId/share/:shareToken', ctrl.getSharedTrip);

export default router;
