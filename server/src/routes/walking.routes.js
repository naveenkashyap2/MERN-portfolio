import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { mapsProvider } from '../providers/maps/index.js';

const router = Router();
router.use(authenticate);

/** POST /api/v1/walking/route */
router.post(
  '/route',
  asyncHandler(async (req, res) => {
    const route = mapsProvider.planRoute({ mode: 'walking', origin: req.body.origin, destination: req.body.destination });
    return ok(res, { route });
  }),
);

/** GET /api/v1/walking/distance */
router.get(
  '/distance',
  asyncHandler(async (req, res) => {
    const origin = { lat: Number(req.query.lat), lng: Number(req.query.lng) };
    const destination = { lat: Number(req.query.dlat), lng: Number(req.query.dlng) };
    const route = mapsProvider.planRoute({ mode: 'walking', origin, destination });
    return ok(res, { distanceMeters: route.distanceMeters });
  }),
);

/** GET /api/v1/walking/eta */
router.get(
  '/eta',
  asyncHandler(async (req, res) => {
    const origin = { lat: Number(req.query.lat), lng: Number(req.query.lng) };
    const destination = { lat: Number(req.query.dlat), lng: Number(req.query.dlng) };
    const route = mapsProvider.planRoute({ mode: 'walking', origin, destination });
    return ok(res, { etaMinutes: route.durationMinutes });
  }),
);

export default router;
