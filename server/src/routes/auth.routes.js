import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema, googleSchema, forgotSchema, resetSchema, passwordSchema } from '../validators/auth.validator.js';
import { z } from 'zod';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), ctrl.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), ctrl.login);
router.post('/google', authLimiter, validate({ body: googleSchema }), ctrl.googleLogin);
router.post('/refresh', ctrl.refresh);
router.post('/logout', optionalAuth, ctrl.logout);
router.post('/logout-all', authenticate, ctrl.logoutAll);
router.post('/forgot-password', authLimiter, validate({ body: forgotSchema }), ctrl.forgotPassword);
router.post('/reset-password', authLimiter, validate({ body: resetSchema }), ctrl.resetPassword);
router.post('/verify-email', ctrl.verifyEmail);
router.post(
  '/change-password',
  authenticate,
  validate({ body: z.object({ currentPassword: z.string().min(1), newPassword: passwordSchema }) }),
  ctrl.changePassword,
);
router.get('/me', authenticate, ctrl.me);

export default router;
