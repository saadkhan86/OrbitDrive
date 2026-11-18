import {
  foreignKey,
  index,
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
import { organization_members } from "./organization_members.Schema";

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
  organizationId: uuid("organization_id")
    .references(() => organizations.id, {
      onDelete: "cascade",
    })
    .notNull(),
  clientId: uuid("client_id"),
  assignedTo: uuid("assigned_to")
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
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  index("tasks_org_createdAt_idx")
    .on(table.createdAt, table.organizationId, table.id),
  foreignKey({
    columns: [
      table.clientId,
      table.organizationId,
    ],
    foreignColumns: [
      clients.id,
      clients.organizationId,
    ],
    name: "tasks_client_org_fk",
  })
    .onDelete("set null"),
  foreignKey({
    columns: [
      table.dealId,
      table.organizationId,
    ],
    foreignColumns: [
      deals.id,
      deals.organizationId,
    ],
    name: "tasks_deal_org_fk",
  })
    .onDelete("set null"),
  foreignKey({
    columns: [
      table.organizationId,
      table.assignedTo
    ],
    foreignColumns: [
      organization_members.id,
      organization_members.userId
    ],
    name: "assigned_usr_org_id_fk",
  })
    .onDelete("set null")
]
)

