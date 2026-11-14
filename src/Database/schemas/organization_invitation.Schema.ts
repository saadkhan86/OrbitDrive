import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.Schema";
import { pgRoleEnum } from "./organization_members.Schema";
import { organizations } from "./organization.Schema";
import { sql } from "drizzle-orm";
export const organization_invitations = pgTable("organization_invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  email: varchar("email", { length: 255 }).notNull(),
  role: pgRoleEnum("role").notNull().default("member"),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).default(
    sql`now() + interval '24 hours'`,
  ),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).default(sql`NULL`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
