import { and, desc, eq, getTableColumns, lt, or, SQL } from "drizzle-orm";
import { VMessageValidator } from "./message.validator";
import { messages } from "../../Database/schemas/messages.Schema";
import { db } from "../../Database";
import { VConversation } from "../Conversation/conversation.validator";
import { VAuth } from "../Auth/auth.validator";
import { cusrorUtils } from "../../Utils/cursot.utils";
import { users } from "../../Database/schemas/users.Schema";
class MessageRepo {
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
    public async query(data: VConversation.conversationId & Omit<VMessageValidator.query, "cursor"> & { cursor: { createdAt: Date, id: string } | null }) {
        const { senderId, ...messagesColumns } = getTableColumns(messages)
        const _query: SQL[] = [eq(messages.conversationId, data.conversationId)]
        if (data.cursor) {
            _query.push(
                or(
                    lt(messages.createdAt, data.cursor.createdAt),
                    and(eq(messages.createdAt, data.cursor.createdAt),
                        lt(messages.id, data.cursor.id)))! as SQL
            )
        }
        return await db.select({
            ...messagesColumns,
            sender: {
                id: users.id,
                name: users.fullName,
                profile: users.profile,
                createdAt: users.createdAt
            }
        })
            .from(messages)
            .where(and(..._query))
            .orderBy(desc(messages.createdAt), desc(messages.id))
            .limit(data.limit + 1)
    }
}
export default new MessageRepo()