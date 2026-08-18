import { Router } from 'express';
import * as ctrl from '../controllers/assistant.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatSchema, createConversationSchema } from '../validators/assistant.validator.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();
router.use(authenticate);

router.post('/chat', aiLimiter, validate({ body: chatSchema }), ctrl.chatMessage);
router.post('/replan', aiLimiter, ctrl.replan);
router.get('/conversations', ctrl.listConversations);
router.post('/conversations', validate({ body: createConversationSchema }), ctrl.createConversation);
router.get('/conversations/:conversationId', ctrl.getConversation);
router.delete('/conversations/:conversationId', ctrl.deleteConversation);

export default router;
