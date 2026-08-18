import { Router } from 'express';
import * as ctrl from '../controllers/ai.controller.js';
import { optionalAuth, authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { generateTripSchema, naturalLanguageSchema } from '../validators/trip.validator.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Trip generation is available to guests (demo) and authenticated users.
router.post('/trip/generate', aiLimiter, optionalAuth, validate({ body: generateTripSchema }), ctrl.generate);
router.post('/trip/natural-language', aiLimiter, optionalAuth, validate({ body: naturalLanguageSchema }), ctrl.naturalLanguage);
router.post('/trip/regenerate', aiLimiter, optionalAuth, validate({ body: generateTripSchema }), ctrl.regenerate);

// These require an existing (owned) trip.
router.use(authenticate);
router.post('/trip/optimize', aiLimiter, ctrl.optimize);
router.post('/trip/replan', aiLimiter, ctrl.replan);
router.post('/trip/budget-optimize', aiLimiter, ctrl.budgetOptimize);
router.post('/trip/route-optimize', aiLimiter, ctrl.routeOptimize);
router.post('/trip/suggest', ctrl.suggest);

export default router;
