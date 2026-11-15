import { and, eq } from "drizzle-orm";
import { VMessageValidator } from "./message.validator";
import { messages } from "../../Database/schemas/messages.Schema";
import { db } from "../../Database";
import { VConversation } from "../Conversation/conversation.validator";
import { VAuth } from "../Auth/auth.validator";
class messageRepo {
    public async create(data: VMessageValidator.messageContent & VConversation.conversationId & VAuth.userId) {
        return (
            await db.insert(messages)
                .values({
                    senderId: data.userId,
                    conversationId: data.conversationId,
                    content: data.content,
                    createdAt: new Date()
                }).returning())[0]
    }
    public async update(data: VMessageValidator.messageContent & VConversation.conversationId & VAuth.userId) {
        return (
            await db.update(messages)
                .set({
                    content: data.content,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(messages.senderId, data.userId),
                        eq(messages.conversationId, data.conversationId))
                ).returning()
        )[0]
    }
    public async query(data: VConversation.conversationId & VMessageValidator.query) {

    }
}
export default new messageRepo()