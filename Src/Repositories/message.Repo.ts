import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { messages } from "../Database/Schemas/messages.Schema";
import { VAuth } from "../Validators/auth.Validator";
import { VMessageValidator } from "../Validators/chat.Validator";
import { VConversation } from "../Validators/conversation.Validator";

class messageRepo {
    public async create(data: VAuth.userId & VMessageValidator.MessageContent & VConversation.ConversationId) {
        return (await db.insert(messages).values({ senderId: data.userId, content: data.content, conversationId: data.conversationId }).returning())[0]
    }
    public async update(data: VAuth.userId & VMessageValidator.MessageContent & VMessageValidator.messageId) {
        return (
            await db.update(messages).set({
                content: data.content,
                updatedAt: new Date()
            })
                .where(and(
                    eq(messages.senderId, data.userId),
                    eq(messages.id, data.messageId))
                ).returning()
        )[0]
    }
    public async query(data: VConversation.ConversationId) {
        
    }
}