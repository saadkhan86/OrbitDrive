import { FastifyReply, FastifyRequest } from "fastify";
import { VConversation } from "../Conversation/conversation.validator";
import { VMessageValidator } from "./message.validator";
import { messageService } from "./message.service";

export const messageController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const messages = await messageService.query(request.params as VConversation.conversationId, request.body as VMessageValidator.query)
        reply.status(200).send({ success: true, message: "messages fetched successfully", data: { messages } })
    }
}