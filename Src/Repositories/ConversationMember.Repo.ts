import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { conversation_members } from "../Database/Schemas/conversation_members.Schema";
import { VConversation } from "../Validators/conversation.Validator";
import { VAuth } from "../Validators/auth.Validator";
import { db } from "../Database";
import { eq } from "drizzle-orm";
import { users } from "../Database/Schemas/users.Schema";

class ConversationMember {
    public async create(tx: NodePgDatabase, data: { conversationId: string, userId: string }[]) {
        const conversationMember = (await tx.insert(conversation_members).values(data).returning())[0]
        return conversationMember
    }
    public async getById(data: VConversation.ConversationId & VAuth.userId) {
        const members = await db.select({ user: { id: users.id, name: users.fullName }, joinedAt: conversation_members.joinedAt })
            .from(conversation_members).innerJoin(users, eq(conversation_members.conversationId, data.conversationId))

        const isMember = members.some(mbr => mbr.user.id == data.userId);
        if (!isMember) return null
        return members
    }
}
export default new ConversationMember()