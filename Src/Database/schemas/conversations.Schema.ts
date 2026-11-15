import { pgEnum, pgTable, varchar, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users.Schema";

export const conversationTypeEnum = pgEnum("conversation_type_enum", ["direct", "group"])

export const conversations = pgTable("chats", {
    id: uuid().defaultRandom().primaryKey(),
    type: conversationTypeEnum("type").notNull().default("direct"),
    name: varchar("name", { length: 100 }),
    createdBy: uuid("created_by").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) =>
    [index("conversation_created_by_idx").on(table.createdBy)]
) 