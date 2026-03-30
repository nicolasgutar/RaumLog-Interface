import { z } from 'zod';

export const AccountTypeSchema = z.enum(['Anfitrión', 'Cliente', 'admin']);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const UserSchema = z.object({
  id: z.number().optional(),
  uid: z.string(),
  email: z.string().email(),
  name: z.string().default(''),
  phone: z.string().default(''),
  role: AccountTypeSchema.default('Cliente'),
  isOnboardingComplete: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
  isUserVerified: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const RegisterRequestSchema = z.object({
  idToken: z.string(),
  name: z.string().optional(),
  role: AccountTypeSchema
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  needsOnboarding: z.boolean()
});
