import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VConversation } from "../Validators/conversation.Validator";
import { VAuth } from "../Validators/auth.Validator";
import { and, count, desc, eq, getTableColumns, ilike, or, SQL, sql } from "drizzle-orm";
import { conversation_members } from "../Database/Schemas/conversation_members.Schema";
import { db } from "../Database";
import { conversations } from "../Database/Schemas/conversations.Schema";
import { users } from "../Database/Schemas/users.Schema";
import { messages } from "../Database/Schemas/messages.Schema";
import { alias } from "drizzle-orm/pg-core";

class ConversationRepo {
    public async create(tx: NodePgDatabase, data: VConversation.Create & VAuth.userId) {
        const conversation = (await tx.insert(conversations).values({
            type: data.type,
            name: data.name ?? "",
            createdBy: data.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning())[0]
        return conversation
    }
    public async query(data: VConversation.Query & VAuth.userId) {
        const { page = 1, limit = 15 } = data
        const _query: SQL[] = [eq(conversation_members.userId, data.userId)]
        if (data.search) _query.push(ilike(conversations.name, `%${data.search}%`))
        const messageSender = alias(users, "message_sender")
        const latestMessage = db.select({
            id: messages.id,
            content: messages.content,
            senderId: messages.senderId,
            createdAt: messages.createdAt
        })
            .from(messages)
            .where(eq(messages.conversationId, conversations.id))
            .orderBy(desc(messages.createdAt))
            .limit(1).as("latest_message")

        const result = await db.select({
            ...getTableColumns(conversations),
            lastMessage: {
                id: latestMessage.id,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt,
                sender: { id: messageSender.id, name: messageSender.fullName } as any,
            }
        })
            .from(conversations)
            .innerJoin(conversation_members, eq(conversations.id, conversation_members.conversationId))
            .leftJoinLateral(latestMessage, sql`true`)
            .leftJoin(messageSender, eq(latestMessage.senderId, messageSender.id))
            .where(and(..._query))
            .orderBy(desc(conversations.createdAt))
            .limit(limit)
            .offset((page - 1) * limit)
    }
    public async getById(data: VConversation.ConversationId & VConversation.ConversationAndMessages & VAuth.userId) {
        const [conversation, members, latestMessages] = await Promise.all([
            db.select().from(conversations).where(eq(conversations.id, data.conversationId)),
            db.select({
                user: { id: users.id, name: users.fullName },
                joinedAt: conversation_members.joinedAt
            })
                .from(conversation_members)
                .innerJoin(users, eq(conversation_members.conversationId, data.conversationId))
                .orderBy(desc(conversation_members.joinedAt))
                .limit(data.members || 5),
            db.select({
                ...getTableColumns(messages),
                sender: { id: users.id, name: users.fullName }
            })
                .from(messages).innerJoin(users, eq(users.id, messages.senderId))
                .where(eq(messages.conversationId, data.conversationId))
                .limit(data.messages || 30)
        ])
        const isMember = members.some(mbr => mbr.user.id == data.userId)
        if (!isMember) return null
        return { ...conversation[0], members, latestMessages }

    }
    public async update(data: { name: string, userId: string, conversationId: string }) {

    }
}
export default new ConversationRepo()