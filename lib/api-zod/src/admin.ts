import { z } from 'zod';
import { UserSchema } from './user';
import { spaceSchema } from './spaces';

export const AdminUserListQuerySchema = z.object({
  limit: z.preprocess((v) => Number(v), z.number().int().min(1).max(100)).default(20),
  page: z.preprocess((v) => v ? Number(v) : 1, z.number().int().min(1)).default(1),
  search: z.string().optional(),
  sortBy: z.enum(['name_asc', 'name_desc']).default('name_asc'),
}).transform((data) => ({
  ...data,
  offset: (data.page - 1) * data.limit,
}));

export const AdminUserListResponseSchema = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    totalCount: z.number(),
    totalPages: z.number(),
  }),
});

export const AdminSpaceListQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  ownerId: z.string().optional(),
});

export const AdminSpaceListResponseSchema = z.object({
  data: z.array(spaceSchema),
  meta: z.object({
    totalCount: z.number(),
    totalPages: z.number(),
  }),
});

export const AdminVerifyUserRequestSchema = z.object({
  verified: z.boolean(),
});

export const AdminToggleVisibilityRequestSchema = z.object({
  isVisible: z.boolean(),
});
