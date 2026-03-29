import { pgTable, text, timestamp, serial, boolean, pgEnum, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spaceStatusEnum = pgEnum("space_status", ["pending", "approved", "rejected"]);
export const spaceCategoryEnum = pgEnum("space_category", ["General", "Muebles", "Cajas", "Vehículos", "Electrodomésticos"]);
export const spaceAccessTypeEnum = pgEnum("space_access_type", ["24/7", "Con cita", "Solo entrega"]);

export const spacesTable = pgTable("spaces", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull().default(""), // Firebase UID
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  ownerPhone: text("owner_phone").notNull().default(""),
  spaceType: text("space_type").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull().default(""),
  description: text("description").notNull().default(""),
  priceMonthly: text("price_monthly").notNull(),
  priceAnnual: text("price_annual").notNull(),
  // Added for filtering and sorting
  priceDailyNum: integer("price_daily_num").notNull().default(0),
  priceMonthlyNum: integer("price_monthly_num").notNull().default(0),
  published: boolean("published").notNull().default(false),
  status: spaceStatusEnum("status").notNull().default("pending"),
  category: spaceCategoryEnum("category").notNull().default("General"),
  accessType: spaceAccessTypeEnum("access_type").notNull().default("24/7"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSpaceSchema = createInsertSchema(spacesTable).omit({
  id: true,
  status: true,
  published: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Space = typeof spacesTable.$inferSelect;
