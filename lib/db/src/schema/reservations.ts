import { pgTable, serial, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending",
  "approved",
  "rejected",
  "paid",
]);

export const reservationsTable = pgTable("reservations", {
  id: serial("id").primaryKey(),
  spaceId: integer("space_id").notNull(),
  spaceTitle: text("space_title").notNull().default(""),
  spaceOwnerEmail: text("space_owner_email").notNull().default(""),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull().default(""),
  itemsDescription: text("items_description").notNull().default(""),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  days: integer("days").notNull().default(1),
  months: integer("months").notNull().default(0),
  totalPrice: text("total_price").notNull().default("0"),
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  status: reservationStatusEnum("status").notNull().default("pending"),
  wompiReference: text("wompi_reference").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({
  id: true,
  status: true,
  wompiReference: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
