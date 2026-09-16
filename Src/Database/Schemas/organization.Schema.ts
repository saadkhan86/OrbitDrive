import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.Schema";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("ownerId").references(() => users.id, {
      onDelete: "cascade",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("organizations_owner_slug_unique").on(table.ownerId, table.slug),
  ],
);
