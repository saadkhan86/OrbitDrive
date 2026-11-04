import { index, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { conversations } from "./conversations.Schema";
import { users } from "./users.Schema";

export const conversation_members = pgTable("conversation_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow()
},
    (table) => [uniqueIndex("conversation_member_unique_idx")
        .on(table.conversationId, table.userId),
    index("conversation_member_user_idx")]
)
