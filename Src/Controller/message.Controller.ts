import { FastifyReply, FastifyRequest } from "fastify";
import { messageService } from "../Services/message.Service";
import { VConversation } from "../Validators/conversation.Validator";
import { VMessageValidator } from "../Validators/chat.Validator";

export const messageController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const messages = await messageService.query(request.params as VConversation.conversationId, request.body as VMessageValidator.query)
        reply.status(200).send({ success: true, message: "messages fetched successfully", data: { messages } })
    }
}