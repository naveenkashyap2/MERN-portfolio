import { Router } from 'express';
import * as ctrl from '../controllers/place.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(optionalAuth);

router.get('/search', ctrl.search);
router.get('/nearby', ctrl.nearby);
router.get('/temples', (req, _res, next) => { req.routeKind = 'temple'; next(); }, ctrl.byCategory);
router.get('/gurudwaras', (req, _res, next) => { req.routeKind = 'gurudwara'; next(); }, ctrl.byCategory);
router.get('/historical', (req, _res, next) => { req.routeKind = 'historical'; next(); }, ctrl.byCategory);
router.get('/nature', (req, _res, next) => { req.routeKind = 'nature'; next(); }, ctrl.byCategory);
router.get('/recommended', (req, _res, next) => { req.routeKind = 'recommended'; next(); }, ctrl.byCategory);
router.get('/:placeId', ctrl.getPlace);

export default router;
