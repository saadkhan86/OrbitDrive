import { VMessageValidator } from "../Validators/chat.Validator";
import { VConversation } from "../Validators/conversation.Validator";

export const messageService = {
    create: async (conversation: VConversation.ConversationId, message: VMessageValidator.MessageContent) => {
        const message = await message
    },
    update: async () => {

    },
    query: async () => {

    }
}