import { VConversation } from "../Conversation/conversation.validator"
import MessageRepo from "./Message.repo"
import { VMessageValidator } from "./message.validator"

export const messageService = {
    query: async (param: VConversation.conversationId, query: VMessageValidator.query) => {
        const messages = await MessageRepo.query({ ...param, ...query })
        return messages
    }
}