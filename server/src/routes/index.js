const { Router } = require('express');
const { authRequired, optionalAuth } = require('../middleware/auth');
const { locationLimiter, searchLimiter, publicLimiter } = require('../middleware/rateLimits');
const {
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
} = require('../controllers/misc.controller');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const tripRoutes = require('./trip.routes');
const aiRoutes = require('./ai.routes');
const assistantRoutes = require('./assistant.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/ai', aiRoutes);
router.use('/assistant', assistantRoutes);

router.post('/location/start', authRequired, locationLimiter, locationCtl.start);
router.post('/location/update', authRequired, locationLimiter, locationCtl.update);
router.post('/location/stop', authRequired, locationCtl.stop);
router.get('/location/current', authRequired, locationCtl.current);
router.get('/location/history', authRequired, locationCtl.history);
router.get('/location/distance', authRequired, locationCtl.distance);
router.get('/location/arrival-status', authRequired, locationCtl.arrival);

router.post('/routes/plan', authRequired, routeCtl.plan);
router.post('/routes/walking', authRequired, routeCtl.walking);
router.post('/routes/driving', authRequired, routeCtl.driving);
router.post('/routes/transit', authRequired, routeCtl.transit);
router.post('/routes/compare', authRequired, routeCtl.compare);
router.get('/routes/:routeId', authRequired, routeCtl.get);

router.get('/transport/trains/search', optionalAuth, searchLimiter, trainCtl.search);
router.get('/transport/trains/availability', optionalAuth, searchLimiter, trainCtl.availability);
router.get('/transport/trains/:trainId/schedule', optionalAuth, trainCtl.schedule);
router.get('/transport/trains/:trainId', optionalAuth, trainCtl.get);

router.get('/transport/buses/search', optionalAuth, searchLimiter, busCtl.search);
router.get('/transport/buses/availability', optionalAuth, searchLimiter, busCtl.availability);
router.get('/transport/buses/:busId/schedule', optionalAuth, busCtl.schedule);
router.get('/transport/buses/:busId', optionalAuth, busCtl.get);

router.post('/walking/route', authRequired, walkingCtl.route);
router.get('/walking/distance', authRequired, walkingCtl.distance);
router.get('/walking/eta', authRequired, walkingCtl.eta);

router.get('/hotels/search', optionalAuth, searchLimiter, hotelCtl.search);
router.get('/hotels/recommended', authRequired, hotelCtl.recommended);
router.get('/hotels/budget', optionalAuth, hotelCtl.budget);
router.get('/hotels/medium', optionalAuth, hotelCtl.medium);
router.get('/hotels/premium', optionalAuth, hotelCtl.premium);
router.get('/hotels/:hotelId', optionalAuth, hotelCtl.get);

router.get('/places/search', publicLimiter, placeCtl.search);
router.get('/places/nearby', optionalAuth, placeCtl.nearby);
router.get('/places/temples', publicLimiter, placeCtl.temples);
router.get('/places/gurudwaras', publicLimiter, placeCtl.gurudwaras);
router.get('/places/historical', publicLimiter, placeCtl.historical);
router.get('/places/nature', publicLimiter, placeCtl.nature);
router.get('/places/recommended', authRequired, placeCtl.recommended);
router.get('/places/:placeId', publicLimiter, placeCtl.get);

router.get('/notifications', authRequired, notifCtl.list);
router.patch('/notifications/read-all', authRequired, notifCtl.readAll);
router.patch('/notifications/:notificationId/read', authRequired, notifCtl.read);
router.delete('/notifications/:notificationId', authRequired, notifCtl.remove);

router.post('/favorites', authRequired, favoriteCtl.add);
router.get('/favorites', authRequired, favoriteCtl.list);
router.get('/favorites/check/:placeId', authRequired, favoriteCtl.check);
router.delete('/favorites/:favoriteId', authRequired, favoriteCtl.remove);

router.get('/health', healthCtl.root);
router.get('/health/database', healthCtl.database);
router.get('/health/services', healthCtl.services);

module.exports = router;
