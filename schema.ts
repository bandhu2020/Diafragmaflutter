import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const stories = pgTable("stories", {
  id: serial().primaryKey(),
  name: text().notNull(),
  role: text().notNull().default(""),
  story: text().notNull(),
  email: text(),
  approved: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
});
