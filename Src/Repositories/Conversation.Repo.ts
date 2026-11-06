import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VConversation } from "../Validators/conversation.Validator";
import { VAuth } from "../Validators/auth.Validator";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { conversation_members } from "../Database/Schemas/conversation_members.Schema";
import { db } from "../Database";
import { conversations } from "../Database/Schemas/conversations.Schema";
import { users } from "../Database/Schemas/users.Schema";
import { messages } from "../Database/Schemas/messages.Schema";

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
        const _query: any[] = [eq(conversation_members.userId, data.userId)]
        if (data.search) _query.push([ilike(conversations.name, `%${data.search}%`)])

        const [foundConversations, total] = await Promise.all(
            [
                db.select().from(conversations).innerJoin(conversation_members, eq(conversation_members.userId, data.userId)).where(and(..._query)).orderBy(desc(conversations.createdAt)).limit(limit).offset((page - 1) * limit),
                db.select({ count: count() }).from(conversations).innerJoin(conversation_members, eq(conversation_members.userId, data.userId)).where(and(..._query))
            ])
        return { conversation: foundConversations, count: total[0]?.count ?? 0 }
    }
    public async getById(data: VConversation.ConversationId & VAuth.userId) {
        const [conversation, members,latestMessages] = await Promise.all([
            db.select().from(conversations).where(eq(conversations.id, data.conversationId)),
            db.select({ user: { id: users.id, name: users.fullName }, joinedAt: conversation_members.joinedAt })
                .from(conversation_members).innerJoin(users, eq(conversation_members.conversationId, data.conversationId)),
            db.select().from(messages).innerJoin(users,eq(users.id,))
            ])
        const isMember = members.some(mbr => mbr.user.id == data.userId)
        if (!isMember) return null
        return { ...conversation[0], members }

    }
}
export default new ConversationRepo()