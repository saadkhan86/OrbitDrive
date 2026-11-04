import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { profile } from "node:console";
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: authProviderEnum("provider").notNull().default("password"),
    pid: varchar("provider_user_id", { length: 255 }),
    fullName: varchar("full_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    profile: varchar("profile").default(""),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    refreshToken: varchar("refresh_token").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("provider_user_unique").on(table.provider, table.pid),
  ],
);
