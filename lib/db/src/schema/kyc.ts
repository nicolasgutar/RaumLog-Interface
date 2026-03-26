import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const kycStatusEnum = pgEnum("kyc_status", ["pending", "approved", "rejected"]);

export const kycSubmissionsTable = pgTable("kyc_submissions", {
  id: serial("id").primaryKey(),
  hostEmail: text("host_email").notNull(),
  hostName: text("host_name").notNull(),
  hostPhone: text("host_phone").notNull().default(""),
  cedulaFilename: text("cedula_filename").notNull().default(""),
  cedulaData: text("cedula_data").notNull().default(""),
  rutFilename: text("rut_filename").notNull().default(""),
  rutData: text("rut_data").notNull().default(""),
  status: kycStatusEnum("status").notNull().default("pending"),
  adminNotes: text("admin_notes").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertKycSchema = createInsertSchema(kycSubmissionsTable).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertKyc = z.infer<typeof insertKycSchema>;
export type KycSubmission = typeof kycSubmissionsTable.$inferSelect;
