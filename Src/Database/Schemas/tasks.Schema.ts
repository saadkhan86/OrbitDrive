import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { users } from "./users.Schema";
import { clients } from "./clients.Schema";
import { deals } from "./deals.Schema";

export const pgTaskPriorityEnum = pgEnum("task_priority", [
  "high",
  "medium",
  "low",
  "urgent",
]);
export const pgTaskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "completed",
  "cancelled",
]);
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organizationId")
    .references(() => organizations.id, {
      onDelete: "cascade",
    })
    .notNull(),
  clientId: uuid("clientId").references(() => clients.id, {
    onDelete: "set null",
  }),
  assignedTo: uuid("assignedTo")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  dealId: uuid("deal_id").references(() => deals.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priority: varchar("priority", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  dueDate: timestamp("dueDate", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});
