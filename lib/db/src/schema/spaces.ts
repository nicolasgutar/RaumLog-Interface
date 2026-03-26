import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spaceStatusEnum = pgEnum("space_status", ["pending", "approved", "rejected"]);

export const spacesTable = pgTable("spaces", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  ownerPhone: text("owner_phone").notNull().default(""),
  spaceType: text("space_type").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull().default(""),
  description: text("description").notNull().default(""),
  priceMonthly: text("price_monthly").notNull().default(""),
  status: spaceStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSpaceSchema = createInsertSchema(spacesTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSpace = z.infer<typeof insertSpaceSchema>;
export type Space = typeof spacesTable.$inferSelect;
