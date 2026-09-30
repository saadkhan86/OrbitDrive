import { pgTable, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organizationId").references(() => organizations.id, {
    onDelete: "cascade",
  }),
});
