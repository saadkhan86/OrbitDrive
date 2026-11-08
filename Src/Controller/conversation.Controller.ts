import { FastifyReply, FastifyRequest } from "fastify";
import { conversationService } from "../Services/conversation.Service";
import { VConversation } from "../Validators/conversation.Validator";

export const conversationController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.create(request.user, request.body as VConversation.Create)
        reply.status(201).send({ success: true, message: "conversation created successfully", data: { conversation } })
    },
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversations = await conversationService.query(request.user, request.query as VConversation.Query)
        reply.status(200).send({ success: true, message: "conversation fetched successfully", data: { conversations } })
    },
    getById: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.getById(request.user, request.params as VConversation.ConversationId, request.query as VConversation.ConversationAndMessages)
        reply.status(200).send({ success: true, message: "conversation fecthed successfully", data: { conversation } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.update(request.user, {
            ...request.body as VConversation.Update, ...request.params as VConversation.ConversationId
        })
        reply.status(200).send({ success: true, message: "conversation updated successfully", data: { conversation } })
    }
}