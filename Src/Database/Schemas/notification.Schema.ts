import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { organizations } from "./organization.Schema";
import { users } from "./users.Schema";

export const NotificationEnum = pgEnum("notification_type", [
  "task_assigned",
  "task_updated",
  "deal_updated",
  "invitation",
  "system",
]);

const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: NotificationEnum("type").notNull(),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
