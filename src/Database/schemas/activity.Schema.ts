import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { clients } from "./clients.Schema";
import { deals } from "./deals.Schema";
import { users } from "./users.Schema";


export const activityTypeEnum = pgEnum("activity_type", [
  "call",
  "email",
  "meeting",
  "note",
]);

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  clientId: uuid("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),

  dealId: uuid("deal_id").references(() => deals.id, {
    onDelete: "set null",
  }),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  type: activityTypeEnum("type").notNull(),

  title: varchar("title", { length: 150 }).notNull(),

  description: text("description"),

  occurredAt: timestamp("occurred_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
