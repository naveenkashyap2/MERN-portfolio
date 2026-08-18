import { z } from 'zod';

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date (YYYY-MM-DD).');

export const createTripSchema = z.object({
  title: z.string().trim().min(2, 'Give your trip a title.').max(100).optional(),
  origin: z.string().trim().min(1, 'Where are you starting from?').max(80),
  destination: z.string().trim().min(1, 'Where are you going?').max(80),
  startDate: isoDateSchema.optional().nullable(),
  endDate: isoDateSchema.optional().nullable(),
  travelers: z
    .object({
      adults: z.number().int().min(1).max(20),
      children: z.number().int().min(0).max(20),
    })
    .optional(),
  budget: z.number().min(100, 'Enter a valid budget.').max(10000000).optional(),
  travelStyle: z.enum(['budget', 'comfort', 'premium']).optional(),
  transportPreference: z.enum(['train', 'bus', 'car', 'walking', 'any']).optional(),
  stayPreference: z.enum(['budget', 'medium', 'premium', 'none']).optional(),
  interests: z.array(z.string().max(30)).max(20).optional(),
});

export const updateTripSchema = createTripSchema.partial();

export const generateTripSchema = z.object({
  origin: z.string().trim().min(1).max(80),
  destination: z.string().trim().min(1).max(80),
  startDate: isoDateSchema.optional().nullable(),
  endDate: isoDateSchema.optional().nullable(),
  travelers: z.object({
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(20),
  }),
  budget: z.number().min(100, 'Enter a valid budget.').max(10000000),
  travelStyle: z.enum(['budget', 'comfort', 'premium']).optional(),
  transportPreference: z.enum(['train', 'bus', 'car', 'walking', 'any']),
  stayPreference: z.enum(['budget', 'medium', 'premium', 'none']),
  interests: z.array(z.string().max(30)).max(20),
});

export const naturalLanguageSchema = z.object({
  text: z.string().trim().min(3, 'Tell me about your trip first.').max(500),
});

export const itineraryItemSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  place: z.string().min(1).max(120),
  category: z.string().max(40).optional(),
  duration: z.string().max(20).optional(),
  distance: z.string().max(20).optional(),
  transport: z.enum(['walk', 'auto', 'taxi', 'train', 'bus', 'metro']).optional(),
  cost: z.number().min(0).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().max(240).optional(),
});

export const reorderSchema = z.object({
  day: z.number().int().positive().optional(),
  itemIds: z.array(z.string()).min(1).max(100),
});
