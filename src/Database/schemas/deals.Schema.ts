import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organization.Schema";
import { clients } from "./clients.Schema";

export const dealStageEnum = pgEnum("deal_stage", [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 150 }).notNull(),

  value: numeric("value", {
    precision: 12,
    scale: 2,
  }).notNull(),

  currency: varchar("currency", {
    length: 3,
  })
    .notNull()
    .default("USD"),

  stage: dealStageEnum("stage").notNull().default("lead"),

  expectedCloseDate: timestamp("expected_close_date", {
    withTimezone: true,
  }),

  description: text("description"),

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
