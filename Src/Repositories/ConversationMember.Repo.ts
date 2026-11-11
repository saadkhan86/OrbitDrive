import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { conversation_members } from "../Database/Schemas/conversation_members.Schema";
import { VConversation } from "../Validators/conversation.Validator";
import { db } from "../Database";
import { count, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { users } from "../Database/Schemas/users.Schema";
import { VConversationMember } from "../Validators/conversationMember.Validator";

class ConversationMember {
    public async create(tx: NodePgDatabase, data: { conversationId: string, userId: string }[]) {
        return (await tx.insert(conversation_members).values(data).returning())[0]

    }
    public async query(data: VConversation.conversationId & VConversationMember.query) {
        const { page = 1, limit = 30 } = data
        const [members, total] = await Promise.all([
            db.select({ ...getTableColumns(conversation_members), user: { name: users.fullName } }).from(conversation_members).where(eq(conversation_members.conversationId, data.conversationId)).innerJoin(users, eq(conversation_members.userId, users.id)).orderBy(desc(conversation_members.joinedAt)).limit(limit).offset((page - 1) * limit),
            db.select({ count: count() }).from(conversation_members).where(eq(conversation_members.conversationId, data.conversationId))
        ])
        return { members, count: total[0]?.count ?? 0 }
    }
    public async remove(data: VConversationMember.update) {
        return (await db.delete(conversation_members).where(inArray(conversation_members.userId, data.participants)).returning())[0] ?? null;
    }
}
export default new ConversationMember()