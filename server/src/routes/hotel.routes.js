import { Router } from 'express';
import * as ctrl from '../controllers/hotel.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(optionalAuth);

router.get('/search', ctrl.search);
router.get('/recommended', ctrl.recommended);
router.get('/budget', (req, _res, next) => { req.routeKind = 'budget'; next(); }, ctrl.byCategory);
router.get('/medium', (req, _res, next) => { req.routeKind = 'medium'; next(); }, ctrl.byCategory);
router.get('/premium', (req, _res, next) => { req.routeKind = 'premium'; next(); }, ctrl.byCategory);
router.get('/:hotelId', ctrl.getHotel);

export default router;
