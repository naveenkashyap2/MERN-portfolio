import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Ask me something first.').max(1000),
  conversationId: z.string().optional(),
  tripId: z.string().optional(),
});

export const createConversationSchema = z.object({
  tripId: z.string().optional(),
  title: z.string().trim().max(80).optional(),
});
