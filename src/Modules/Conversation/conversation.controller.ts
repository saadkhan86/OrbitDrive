import { FastifyReply, FastifyRequest } from "fastify";
import { conversationService } from "../services/conversation.service";
import { VConversation } from "../validators/conversation.validator";

export const conversationController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.create(request.user, request.body as VConversation.create)
        reply.status(201).send({ success: true, message: "conversation created successfully", data: { conversation } })
    },
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversations = await conversationService.query(request.user, request.query as VConversation.query)
        reply.status(200).send({ success: true, message: "conversation fetched successfully", data: { conversations } })
    },
    getById: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.getById(request.user, request.params as VConversation.conversationId, request.query as VConversation.conversationAndMessages)
        reply.status(200).send({ success: true, message: "conversation fecthed successfully", data: { conversation } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.update(request.user, {
            ...request.body as VConversation.update, ...request.params as VConversation.conversationId
        })
        reply.status(200).send({ success: true, message: "conversation updated successfully", data: { conversation } })
    }
}