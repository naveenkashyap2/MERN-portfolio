import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { placesProvider } from '../providers/places/index.js';

/** GET /api/v1/places/search */
export const search = asyncHandler(async (req, res) => {
  const result = placesProvider.search({
    q: req.query.q,
    category: req.query.category,
    city: req.query.city,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 24,
  });
  return ok(res, result);
});

/** GET /api/v1/places/nearby */
export const nearby = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw ApiError.badRequest('A valid latitude and longitude are required for nearby search.');
  }
  const items = placesProvider.nearby({
    lat,
    lng,
    radiusKm: Number(req.query.radius) || 5,
    category: req.query.category,
    limit: Number(req.query.limit) || 12,
  });
  return ok(res, { items });
});

/** GET /api/v1/places/:placeId */
export const getPlace = asyncHandler(async (req, res) => {
  const place = placesProvider.getById(req.params.placeId);
  if (!place) throw ApiError.notFound('Place not found.');
  const nearby = placesProvider.nearby({
    lat: place.coordinates.lat,
    lng: place.coordinates.lng,
    radiusKm: 5,
    limit: 4,
  }).filter((p) => p.id !== place.id);
  return ok(res, { place, nearby });
});

/** GET /api/v1/places/{temples|gurudwaras|historical|nature|recommended} */
export const byCategory = asyncHandler(async (req, res) => {
  const kind = req.routeKind;
  if (kind === 'recommended') {
    const items = placesProvider.recommended({ interests: req.query.interests ? String(req.query.interests).split(',') : [], limit: Number(req.query.limit) || 12 });
    return ok(res, { items });
  }
  const items = placesProvider.byCategory(kind);
  return ok(res, { items });
});
