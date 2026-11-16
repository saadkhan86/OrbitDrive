import { cusrorUtils } from "../../Utils/cursot.utils"
import { VConversation } from "../Conversation/conversation.validator"
import MessageRepo from "./Message.repo"
import { VMessageValidator } from "./message.validator"

export const messageService = {
    query: async (param: VConversation.conversationId, query: VMessageValidator.query) => {
        const decodedCursor = cusrorUtils.decode(query.cursor)
        const cursor = decodedCursor ? { createdAt: new Date(decodedCursor.createdAt), id: decodedCursor.id } : null
        const messages = await MessageRepo.query({ ...param, ...query, cursor })
        const hasNextPage = messages.length > query.limit
        const data = messages.slice(0, query.limit)
        const lastMessage = data[data.length - 1]
        const nextCursor = hasNextPage && lastMessage ? cusrorUtils.encode({ id: lastMessage.id, createdAt: lastMessage.createdAt.toISOString() }) : null;
        return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
    }
}