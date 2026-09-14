import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { string } from "zod";
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("fullName", { length: 50 }).notNull(),
    provider: authProviderEnum("provider").notNull().default("password"),
    providerUserId: varchar("provider_user_id", { length: 255 }),
    email: varchar("email", { length: 50 }).notNull().unique(),
    passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
    isEmailVerified: boolean("isEmailVerified").default(false).notNull(),
    refreshToken: varchar("refreshToken").default(""),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    unique("provider_user_unique").on(table.provider, table.providerUserId),
  ],
);
