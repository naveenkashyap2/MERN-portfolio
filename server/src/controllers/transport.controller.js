import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { transportProvider } from '../providers/transport/index.js';

/** GET /api/v1/transport/trains/search */
export const searchTrains = asyncHandler(async (req, res) => {
  const result = transportProvider.searchTrains({ from: req.query.from, to: req.query.to, date: req.query.date });
  return ok(res, result);
});

/** GET /api/v1/transport/trains/:trainId */
export const getTrain = asyncHandler(async (req, res) => {
  const train = transportProvider.getTrain(req.params.trainId);
  if (!train) throw ApiError.notFound('Train not found.');
  return ok(res, { train: { ...train, verified: false } });
});

/** GET /api/v1/transport/trains/:trainId/schedule */
export const trainSchedule = asyncHandler(async (req, res) => {
  const train = transportProvider.getTrain(req.params.trainId);
  if (!train) throw ApiError.notFound('Train not found.');
  return ok(res, { train, schedule: null, note: 'Live schedule requires a verified provider.' });
});

/** GET /api/v1/transport/trains/availability */
export const trainAvailability = asyncHandler(async (req, res) => {
  const train = transportProvider.getTrain(req.query.trainId);
  return ok(res, {
    trainId: req.query.trainId || null,
    availability: train ? 'estimate' : null,
    verified: false,
    message: 'Live train availability could not be verified — connect a verified provider (e.g. RailYatri/IRCTC) to enable it.',
  });
});

/** GET /api/v1/transport/buses/search */
export const searchBuses = asyncHandler(async (req, res) => {
  const result = transportProvider.searchBuses({ from: req.query.from, to: req.query.to, date: req.query.date });
  return ok(res, result);
});

/** GET /api/v1/transport/buses/:busId */
export const getBus = asyncHandler(async (req, res) => {
  const bus = transportProvider.getBus(req.params.busId);
  if (!bus) throw ApiError.notFound('Bus not found.');
  return ok(res, { bus: { ...bus, verified: false } });
});

/** GET /api/v1/transport/buses/:busId/schedule */
export const busSchedule = asyncHandler(async (req, res) => {
  const bus = transportProvider.getBus(req.params.busId);
  if (!bus) throw ApiError.notFound('Bus not found.');
  return ok(res, { bus, schedule: null, note: 'Live schedule requires a verified provider.' });
});

/** GET /api/v1/transport/buses/availability */
export const busAvailability = asyncHandler(async (req, res) => {
  return ok(res, {
    busId: req.query.busId || null,
    availability: null,
    verified: false,
    message: 'Live bus availability could not be verified.',
  });
});

/** GET /api/v1/transport/compare */
export const compare = asyncHandler(async (req, res) => {
  const result = transportProvider.compare({ from: req.query.from, to: req.query.to });
  return ok(res, result);
});

/** GET /api/v1/transport/local */
export const localModes = asyncHandler(async (_req, res) => {
  return ok(res, { modes: transportProvider.localModes() });
});
