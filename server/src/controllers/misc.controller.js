const { asyncHandler } = require('../utils/asyncHandler');
const { ok } = require('../utils/ApiResponse');
const location = require('../services/location.service');
const routes = require('../services/route.service');
const favorites = require('../services/favorite.service');
const notifications = require('../services/notification.service');
const places = require('../providers/places/catalogPlacesProvider');
const hotels = require('../providers/hotels/catalogHotelsProvider');
const transport = require('../providers/transport/unverifiedTransportProvider');
const maps = require('../providers/maps/geometricMapsProvider');
const gemini = require('../providers/gemini/geminiProvider');
const { dbStatus } = require('../config/db');
const { paginate, pageResult } = require('../utils/pagination');
const { UNVERIFIED_LIVE } = require('../constants');

const locationCtl = {
  start: asyncHandler(async (req, res) => ok(res, await location.start(req))),
  update: asyncHandler(async (req, res) => ok(res, await location.update(req))),
  stop: asyncHandler(async (req, res) => ok(res, await location.stop(req))),
  current: asyncHandler(async (req, res) => ok(res, await location.current(req))),
  history: asyncHandler(async (req, res) => ok(res, await location.history(req))),
  distance: asyncHandler(async (req, res) => ok(res, await location.distance(req))),
  arrival: asyncHandler(async (req, res) => ok(res, await location.arrivalStatus(req))),
};

const routeCtl = {
  plan: asyncHandler(async (req, res) => ok(res, await routes.plan(req, 'driving'))),
  walking: asyncHandler(async (req, res) => ok(res, await routes.plan(req, 'walking'))),
  driving: asyncHandler(async (req, res) => ok(res, await routes.plan(req, 'driving'))),
  transit: asyncHandler(async (req, res) => ok(res, await routes.plan(req, 'transit'))),
  compare: asyncHandler(async (req, res) => ok(res, await routes.compare(req))),
  get: asyncHandler(async (req, res) => ok(res, await routes.getRoute(req))),
};

const walkingCtl = {
  route: asyncHandler(async (req, res) => ok(res, await routes.plan(req, 'walking'))),
  distance: asyncHandler(async (req, res) => ok(res, await routes.walkingDistance(req))),
  eta: asyncHandler(async (req, res) => ok(res, await routes.walkingDistance(req))),
};

const favoriteCtl = {
  add: asyncHandler(async (req, res) => ok(res, await favorites.add(req), 'Saved.')),
  list: asyncHandler(async (req, res) => ok(res, await favorites.list(req))),
  remove: asyncHandler(async (req, res) => ok(res, await favorites.remove(req))),
  check: asyncHandler(async (req, res) => ok(res, await favorites.check(req))),
};

const notifCtl = {
  list: asyncHandler(async (req, res) => ok(res, await notifications.list(req))),
  read: asyncHandler(async (req, res) => ok(res, await notifications.markRead(req))),
  readAll: asyncHandler(async (req, res) => ok(res, await notifications.markAll(req))),
  remove: asyncHandler(async (req, res) => ok(res, await notifications.remove(req))),
};

const placeCtl = {
  search: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    const result = places.search({ q: req.query.q, category: req.query.category, city: req.query.city, page, limit });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
  nearby: asyncHandler(async (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    ok(res, places.nearby({ lat, lng, radiusKm: Number(req.query.radiusKm || 10), category: req.query.category }));
  }),
  get: asyncHandler(async (req, res) => {
    const item = places.getById(req.params.placeId);
    if (!item) return res.status(404).json({ success: false, message: 'Place not found.', requestId: req.requestId });
    ok(res, { place: item });
  }),
  temples: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    const result = places.byCategory('temple', { page, limit, city: req.query.city });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
  gurudwaras: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    const result = places.byCategory('gurudwara', { page, limit, city: req.query.city });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
  historical: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    const result = places.byCategory('historical', { page, limit, city: req.query.city });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
  nature: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    const result = places.byCategory('nature', { page, limit, city: req.query.city });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
  recommended: asyncHandler(async (req, res) => {
    const interests = req.user?.preferences?.interests || [];
    const category = interests[0];
    const { page, limit } = paginate(req.query);
    const result = places.search({ category, page, limit });
    ok(res, pageResult(result.items, result.total, page, limit));
  }),
};

const hotelCtl = {
  search: asyncHandler(async (req, res) => {
    const { page, limit } = paginate(req.query);
    ok(res, hotels.search({ city: req.query.city, category: req.query.category, page, limit }));
  }),
  get: asyncHandler(async (req, res) => {
    const item = hotels.getById(req.params.hotelId);
    if (!item) return res.status(404).json({ success: false, message: 'Hotel not found.', requestId: req.requestId });
    ok(res, { hotel: item });
  }),
  recommended: asyncHandler(async (req, res) => {
    ok(res, hotels.recommended({ city: req.query.city, stayPreference: req.user?.preferences?.preferredHotel }));
  }),
  budget: asyncHandler(async (req, res) => ok(res, hotels.search({ city: req.query.city, category: 'budget' }))),
  medium: asyncHandler(async (req, res) => ok(res, hotels.search({ city: req.query.city, category: 'medium' }))),
  premium: asyncHandler(async (req, res) => ok(res, hotels.search({ city: req.query.city, category: 'premium' }))),
};

const trainCtl = {
  search: asyncHandler(async (req, res) => ok(res, transport.searchTrains(req.query))),
  get: asyncHandler(async (req, res) => ok(res, { ...transport.getTrain(), id: req.params.trainId, message: UNVERIFIED_LIVE })),
  schedule: asyncHandler(async (req, res) => ok(res, { items: [], live: false, message: UNVERIFIED_LIVE })),
  availability: asyncHandler(async (req, res) => ok(res, { live: false, message: UNVERIFIED_LIVE })),
};

const busCtl = {
  search: asyncHandler(async (req, res) => ok(res, transport.searchBuses(req.query))),
  get: asyncHandler(async (req, res) => ok(res, { ...transport.getBus(), id: req.params.busId, message: UNVERIFIED_LIVE })),
  schedule: asyncHandler(async (req, res) => ok(res, { items: [], live: false, message: UNVERIFIED_LIVE })),
  availability: asyncHandler(async (req, res) => ok(res, { live: false, message: UNVERIFIED_LIVE })),
};

const healthCtl = {
  root: asyncHandler(async (req, res) => {
    ok(res, { api: 'ok', time: new Date().toISOString() });
  }),
  database: asyncHandler(async (req, res) => {
    ok(res, { database: dbStatus() });
  }),
  services: asyncHandler(async (req, res) => {
    ok(res, {
      gemini: gemini.status(),
      maps: maps.status(),
      transport: transport.status(),
      hotels: hotels.status(),
      places: places.status(),
    });
  }),
};

module.exports = {
  locationCtl,
  routeCtl,
  walkingCtl,
  favoriteCtl,
  notifCtl,
  placeCtl,
  hotelCtl,
  trainCtl,
  busCtl,
  healthCtl,
};
