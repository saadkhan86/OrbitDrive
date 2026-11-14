import { FastifyReply, FastifyRequest } from "fastify";
import { messageService } from "../services/message.service";
import { VConversation } from "../validators/conversation.validator";
import { VMessageValidator } from "../validators/chat.validator";

export const messageController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const messages = await messageService.query(request.params as VConversation.conversationId, request.body as VMessageValidator.query)
        reply.status(200).send({ success: true, message: "messages fetched successfully", data: { messages } })
    }
}