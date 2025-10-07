import { mysqlTable, varchar, timestamp, text } from "drizzle-orm/mysql-core";

export const organisation = mysqlTable("organisation", {
  id: varchar({ length: 36 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  description: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().onUpdateNow().notNull(),
});
