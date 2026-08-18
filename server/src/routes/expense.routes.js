import { Router } from 'express';
import * as ctrl from '../controllers/expense.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator.js';

const router = Router({ mergeParams: true });
router.use(authenticate);

router.post('/', validate({ body: createExpenseSchema }), ctrl.create);
router.get('/', ctrl.list);
router.get('/summary', ctrl.summary);
router.get('/:expenseId', ctrl.getOne);
router.patch('/:expenseId', validate({ body: updateExpenseSchema }), ctrl.update);
router.delete('/:expenseId', ctrl.remove);

export default router;
