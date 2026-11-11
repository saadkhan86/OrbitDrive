import messageRepo from "../Repositories/message.Repo";
import { VMessageValidator } from "../Validators/chat.Validator";
import { VConversation } from "../Validators/conversation.Validator";

export const messageService = {
    query: async (conversation: VConversation.conversationId, query: VMessageValidator.query) => {
        const messages = await messageRepo.query({ ...conversation, ...query })
        return messages
    }
}