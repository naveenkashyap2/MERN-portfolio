import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { hotelsProvider } from '../providers/hotels/index.js';

/** GET /api/v1/hotels/search */
export const search = asyncHandler(async (req, res) => {
  const amenities = req.query.amenities ? String(req.query.amenities).split(',').filter(Boolean) : [];
  const result = hotelsProvider.search({
    q: req.query.q,
    city: req.query.city,
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    minRating: req.query.minRating,
    amenities,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  });
  return ok(res, result);
});

/** GET /api/v1/hotels/:hotelId */
export const getHotel = asyncHandler(async (req, res) => {
  const hotel = hotelsProvider.getById(req.params.hotelId);
  if (!hotel) throw ApiError.notFound('Hotel not found.');
  return ok(res, { hotel });
});

/** GET /api/v1/hotels/recommended */
export const recommended = asyncHandler(async (req, res) => {
  const list = hotelsProvider.recommended({
    city: req.query.city,
    stayPreference: req.query.stayPreference || 'medium',
    limit: Number(req.query.limit) || 6,
  });
  return ok(res, { items: list });
});

/** GET /api/v1/hotels/{budget|medium|premium} */
export const byCategory = asyncHandler(async (req, res) => {
  const list = hotelsProvider.byCategory(req.routeKind);
  return ok(res, { items: list });
});
