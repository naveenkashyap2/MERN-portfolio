import { z } from 'zod';

export const locationPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(100000).optional(),
  sessionId: z.string().optional(),
  tripId: z.string().optional(),
});

export const startSessionSchema = z.object({
  tripId: z.string().optional(),
  destination: z
    .object({
      name: z.string().min(1).max(120),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
  destinationRadius: z.number().min(20).max(1000).optional(),
});

export const stopSessionSchema = z.object({
  sessionId: z.string().min(1),
});
