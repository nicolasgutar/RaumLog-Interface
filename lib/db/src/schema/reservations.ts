import { pgTable, serial, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reservationStatusEnum = pgEnum("reservation_status", [
  "pending_approval",
  "approved_by_host",
  "rejected",
  "paid",
  "in_storage",
  "completed",
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
  declaredValue: text("declared_value").notNull().default("0"),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  days: integer("days").notNull().default(1),
  months: integer("months").notNull().default(0),
  totalPrice: text("total_price").notNull().default("0"),
  hostNetPrice: text("host_net_price").notNull().default("0"),
  platformCommission: text("platform_commission").notNull().default("0"),
  acceptedTerms: boolean("accepted_terms").notNull().default(false),
  status: reservationStatusEnum("status").notNull().default("pending_approval"),
  wompiReference: text("wompi_reference").notNull().default(""),
  checkinNotes: text("checkin_notes").notNull().default(""),
  checkinPhotos: text("checkin_photos").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservationsTable).omit({
  id: true,
  status: true,
  wompiReference: true,
  checkinNotes: true,
  checkinPhotos: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservationsTable.$inferSelect;
export type ReservationStatus = typeof reservationStatusEnum.enumValues[number];
