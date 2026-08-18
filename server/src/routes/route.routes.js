import { Router } from 'express';
import * as ctrl from '../controllers/route.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

function withKind(kind) {
  return (req, _res, next) => {
    req.routeKind = kind;
    next();
  };
}

const router = Router();
router.use(authenticate);

router.post('/plan', withKind('plan'), ctrl.planRoute);
router.post('/walking', withKind('walking'), ctrl.planRoute);
router.post('/driving', withKind('driving'), ctrl.planRoute);
router.post('/transit', withKind('transit'), ctrl.planRoute);
router.post('/compare', ctrl.compare);
router.get('/:routeId', ctrl.getRoute);

export default router;
