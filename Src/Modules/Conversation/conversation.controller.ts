import { FastifyReply, FastifyRequest } from "fastify";
import { conversationService } from "./conversation.service";
import { VConversation } from "./conversation.validator";
import { IReply } from "../../Interfaces/IReply";

export const conversationController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversations: IReply.queryReturn = await conversationService.query(request.user, request.query as VConversation.query)
        reply.status(200).send({ success: true, message: "conversation fetched successfully", data: { conversations } })
    },
    getById: async (request: FastifyRequest, reply: FastifyReply) => {
        const conversation = await conversationService.getById(request.user, request.params as VConversation.conversationId, request.query as VConversation.conversationAndMessages)
        reply.status(200).send({ success: true, message: "conversation fecthed successfully", data: conversation })
    },
}