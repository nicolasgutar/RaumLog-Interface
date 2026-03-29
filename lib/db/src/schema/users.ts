import { pgTable, serial, text, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
export const userRoleEnum = pgEnum("user_role", ["Anfitrión", "Cliente", "admin"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").unique().notNull(), // Firebase UID
  email: text("email").unique().notNull(),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  role: userRoleEnum("role").notNull().default("Cliente"),
  isOnboardingComplete: boolean("is_onboarding_complete").notNull().default(false),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isUserVerified: boolean("is_user_verified").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
