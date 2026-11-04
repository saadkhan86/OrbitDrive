import { PgArray, pgTable, uuid } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
    id: uuid().defaultRandom().primaryKey(),
    participants:PgArray
}) 