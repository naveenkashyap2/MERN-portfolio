import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.').max(120);

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(72)
  .regex(/[a-z]/, 'Password needs a lowercase letter.')
  .regex(/[A-Z]/, 'Password needs an uppercase letter.')
  .regex(/[0-9]/, 'Password needs a number.')
  .regex(/[^A-Za-z0-9]/, 'Password needs a special character.');

export const nameSchema = z.string().trim().min(2, 'Enter your name.').max(80);

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.').max(128),
});

export const googleSchema = z.object({
  credential: z.string().min(20, 'Google credential is required.'),
});

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});
