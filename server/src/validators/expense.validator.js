import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().positive('Enter a valid amount.').max(10000000),
  category: z.enum(['transport', 'hotel', 'food', 'shopping', 'activities', 'other']),
  description: z.string().trim().max(200).optional(),
  date: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
