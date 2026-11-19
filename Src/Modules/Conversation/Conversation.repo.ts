import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, desc, eq, getTableColumns, ilike, lt, or, SQL, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { conversations } from "../../Database/schemas/conversations.Schema";
import { VConversation } from "./conversation.validator";
import { VAuth } from "../Auth/auth.validator";
import { conversation_members } from "../../Database/schemas/conversation_members.Schema";
import { users } from "../../Database/schemas/users.Schema";
import { db } from "../../Database";
import { messages } from "../../Database/schemas/messages.Schema";
import { ICursor } from "../../Interfaces/ICursor";
import conversationRefColumns from "./conversation.refrence";
import userRefColumns from "../User/user.reference";
class ConversationRepo {
    public async create(tx: NodePgDatabase, data: VConversation.create & VAuth.userId) {
        return (
            await tx
                .insert(conversations)
                .values(
                    {
                        type: data.type,
                        name: data.name ?? "",
                        createdBy: data.userId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                )
                .returning()
        )[0]
    }
    public async query(data: VAuth.userId & Omit<VConversation.query, "cursor"> & ICursor.query) {
        const _query: SQL[] = [eq(conversation_members.userId, data.userId)]
        if (data.search) _query.push(ilike(conversations.name, `%${data.search}%`))
        if (data.cursor) {
            _query.push(
                or(
                    lt
                        (conversations.createdAt, data.cursor.createdAt),
                    and(
                        eq(conversations.createdAt, data.cursor.createdAt),
                        lt(conversations.id, data.cursor.id)
                    )
                )! as SQL
            )
        }
        const messageSender = alias(users, "message_sender")
        const latestMessage = db
            .select(
                {
                    id: messages.id,
                    content: messages.content,
                    senderId: messages.senderId,
                    createdAt: messages.createdAt
                }
            )
            .from(messages)
            .where(eq(messages.conversationId, conversations.id))
            .orderBy(desc(messages.createdAt))
            .limit(1)
            .as("latest_message")

        return await db
            .select({
                ...getTableColumns(conversations),
                lastMessage: {
                    id: latestMessage.id,
                    content: latestMessage.content,
                    createdAt: latestMessage.createdAt,
                    sender: { id: messageSender.id, name: messageSender.fullName } as any,
                }
            })
            .from(conversations)
            .innerJoin(
                conversation_members,
                eq(
                    conversations.id,
                    conversation_members.conversationId
                )
            )
            .leftJoinLateral(latestMessage, sql`true`)
            .leftJoin(messageSender, eq(latestMessage.senderId, messageSender.id))
            .where(and(..._query))
            .orderBy(desc(conversations.createdAt), desc(conversations.id))
            .limit(data.limit + 1)
    }
    public async getById(data: VConversation.conversationId & VConversation.conversationAndMessages & VAuth.userId) {
        return (
            await db
                .select({
                    ...conversationRefColumns,
                    createdBy: {
                        ...userRefColumns
                    }
                })
                .from(conversations)
                .innerJoin(users, eq(users.id, conversations.createdBy))
                .where(
                    eq(
                        conversations.id,
                        data.conversationId
                    )
                )
                .limit(1)
        )[0]

    }
    public async update(data: { name: string, userId: string, conversationId: string }) {
        return (await db.update(conversations).set({ name: data.name, updatedAt: new Date() }).where(eq(conversations.id, data.conversationId)).returning())[0]
    }
}
export default new ConversationRepo()