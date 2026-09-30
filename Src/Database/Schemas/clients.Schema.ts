import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
export const pgClientStatusEnum = pgEnum("client_status", [
  "active",
  "inactive",
  "prospect",
  "customer",
  "lead",
  "vip",
]);
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organizationId").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  status: pgClientStatusEnum("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});
