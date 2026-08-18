import { Router } from 'express';
import * as ctrl from '../controllers/itinerary.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { itineraryItemSchema, reorderSchema } from '../validators/trip.validator.js';

const router = Router({ mergeParams: true });
router.use(authenticate);

router.get('/', ctrl.getItinerary);
router.post('/', validate({ body: itineraryItemSchema }), ctrl.addItem);
router.post('/reorder', validate({ body: reorderSchema }), ctrl.reorder);
router.get('/day/:day', ctrl.getDay);
router.patch('/:itemId', validate({ body: itineraryItemSchema.partial() }), ctrl.updateItem);
router.delete('/:itemId', ctrl.deleteItem);

export default router;
