import { z } from "zod";

export const spaceCategoryEnumSchema = z.enum([
  "General",
  "Muebles",
  "Cajas",
  "Vehículos",
  "Electrodomésticos",
]);

export const spaceAccessTypeEnumSchema = z.enum([
  "24/7",
  "Con cita",
  "Solo entrega",
]);

export const spacesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional().default(12),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
  category: spaceCategoryEnumSchema.optional(),
  accessType: spaceAccessTypeEnumSchema.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
});

export const spaceSchema = z.object({
  id: z.number().int(),
  ownerName: z.string(),
  ownerEmail: z.string().email(),
  ownerPhone: z.string(),
  spaceType: z.string(),
  city: z.string(),
  address: z.string(),
  description: z.string(),
  priceMonthly: z.string(),
  priceDaily: z.string(),
  priceAnnual: z.string(),
  category: spaceCategoryEnumSchema,
  accessType: spaceAccessTypeEnumSchema,
  images: z.array(z.string()),
  published: z.boolean(),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.string(), // ISO string from backend
  updatedAt: z.string(), // ISO string from backend
});

export const spacesResponseSchema = z.object({
  data: z.array(spaceSchema),
  meta: z.object({
    totalCount: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type SpacesQuery = z.infer<typeof spacesQuerySchema>;
export type SpacesResponse = z.infer<typeof spacesResponseSchema>;
export type SpaceDTO = z.infer<typeof spaceSchema>;
