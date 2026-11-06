import { db } from "../Database";
import { messages } from "../Database/Schemas/messages.Schema";

class ChatRepo {
    public async create(data: typeof messages.$inferInsert) {
        const chat = (await db.insert(messages).values({
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning())[0]
        return chat
    }
    public async update(data: any) {
        let newData: Partial<typeof messages.$inferInsert> = {}
        newData.conversationId = data.conversationId
        newData.senderId = data.senderId
        if (data.content) newData.content = data.content
        const updatedChat = (await db.update(messages).set({ content: data.content, updatedAt: new Date() }).returning())[0]
        return updatedChat
    }
    public async query(data: any) {

    }
}