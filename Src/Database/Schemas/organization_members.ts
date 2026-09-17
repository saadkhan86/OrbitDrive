import { pgTable, uuid, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { users } from "./users.Schema";
export const pgRoleEnum = pgEnum("organization_member_role", [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);
export const organization_members = pgTable(
  "organization_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organizationId")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("userId").references(() => users.id),
    role: pgRoleEnum("role").notNull().default("MEMBER"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("organization_member_org_user_unique").on(
      table.organizationId,
      table.userId,
    ),
  ],
);
