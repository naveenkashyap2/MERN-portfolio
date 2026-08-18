import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { mapsProvider } from '../providers/maps/index.js';

const modes = { plan: 'driving', walking: 'walking', driving: 'driving', transit: 'driving' };

/** POST /api/v1/routes/{plan|walking|driving|transit} */
export const planRoute = asyncHandler(async (req, res) => {
  const mode = modes[req.routeKind] || 'driving';
  const { origin, destination } = req.body;
  const route = mapsProvider.planRoute({ mode, origin, destination });
  return ok(res, { route });
});

/** POST /api/v1/routes/compare */
export const compare = asyncHandler(async (req, res) => {
  const { origin, destination } = req.body;
  const result = mapsProvider.compare({ origin, destination });
  return ok(res, result);
});

/** GET /api/v1/routes/:routeId */
export const getRoute = asyncHandler(async (_req, res) => {
  return ok(res, { route: null, message: 'Route results are computed on demand and not persisted in demo mode.' });
});
