import { pgTable, uuid, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { users } from "./users.Schema";
export const pgRoleEnum = pgEnum("organization_member_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);
export const organization_members = pgTable(
  "organization_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    role: pgRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("organization_member_org_user_unique").on(
      table.organizationId,
      table.userId,
    ),
  ],
);
