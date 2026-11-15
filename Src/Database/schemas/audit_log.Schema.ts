import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { users } from "./users.Schema";

export const actionEnum = pgEnum("audit_log_action", ["create", "update", "delete", "invite", "join"])
export const entityTypeEnum = pgEnum("audit_log_entity_type", ["organization_member", "organization_invite", "deal", "client", "task", "activity"])

export const audit_logs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),

  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  entityType: entityTypeEnum("entity_type").notNull(),
  action: actionEnum("action").notNull(),

  entityId: uuid("entity_id").notNull(),

  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
