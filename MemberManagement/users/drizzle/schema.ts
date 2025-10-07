import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar({ length: 36 }).primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password_hash: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).unique(),
  created_at: timestamp().defaultNow().notNull(),
});

export const user_organization = mysqlTable("user_organization", {
  id: varchar({ length: 36 }).primaryKey(),
  user_id: varchar({ length: 36 }).notNull(),
  organization_id: varchar({ length: 36 }).notNull(),
  role: varchar({ length: 50 }).default("member"),
  status: varchar({ length: 50 }).default("active"),
  created_at: timestamp().defaultNow().notNull(),
});

export const user_invitation = mysqlTable("user_invitation", {
  id: varchar({ length: 36 }).primaryKey(),
  inviter_id: varchar({ length: 36 }).notNull(),
  invitee_email: varchar({ length: 255 }).notNull(),
  organization_id: varchar({ length: 36 }).notNull(),
  status: varchar({ length: 50 }).default("pending"),
  token: varchar({ length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
});