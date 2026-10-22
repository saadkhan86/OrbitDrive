import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
export const authProviderEnum = pgEnum("auth_provider", ["password", "google"]);
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 50 }).notNull(),
    provider: authProviderEnum("provider").notNull().default("password"),
    providerUserId: varchar("provider_user_id", { length: 255 }),
    email: varchar("email", { length: 50 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    refreshToken: varchar("refresh_token").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("provider_user_unique").on(table.provider, table.providerUserId),
  ],
);
