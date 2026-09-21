import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.Schema";
import { pgRoleEnum } from "./organization_members.Schema";
import { organizations } from "./organization.Schema";
export const organization_invitations = pgTable("organization_invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  createdBy: uuid("createdBy")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  email: varchar("email", { length: 255 }).notNull(),
  role: pgRoleEnum("role").notNull().default("MEMBER"),
  tokenHash: varchar("tokenHash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).defaultNow(),
  acceptedAt: timestamp("acceptedAt", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});
