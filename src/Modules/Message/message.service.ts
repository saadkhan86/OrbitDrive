import messageRepo from "../repositories/Message.repo";
import { VMessageValidator } from "../validators/chat.validator";
import { VConversation } from "../validators/conversation.validator";

export const messageService = {
    query: async (conversation: VConversation.conversationId, query: VMessageValidator.query) => {
        const messages = await messageRepo.query({ ...conversation, ...query })
        return messages
    }
}