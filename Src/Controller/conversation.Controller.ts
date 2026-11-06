import { FastifyReply, FastifyRequest } from "fastify";
import { conversationService } from "../Services/conversation.Service";
import { VConversation } from "../Validators/conversation.Validator";

export const conversationController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.create(request.user, request.body as VConversation.Create)
        reply.status(201).send({ success: true, message: "conversation created successfully", data: { conversation } })

    },
    query: async (request:FastifyRequest,reply:FastifyReply) => {
        const conversations = await conversationService.query()
    },
    delete: async () => { }
}