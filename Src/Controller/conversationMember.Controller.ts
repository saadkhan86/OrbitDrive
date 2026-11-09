import { FastifyReply, FastifyRequest } from "fastify";
import { conversationMemberService } from "../Services/conversationMember.Service";
import { VConversation } from "../Validators/conversation.Validator";
import { VConversationMember } from "../Validators/conversationMember.Validator";

export const conversationMemberController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const members = await conversationMemberService.query(request.params as VConversation.ConversationId, request.query as VConversationMember.query)
        reply.status(200).send({ success: true, message: "members fetched successfully", data: { members } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const member = await conversationMemberService.update(request.user, request.params as VConversation.ConversationId, request.body as VConversationMember.Update)
        reply.status(200).send({ success: true, message: "Member updated successfully", data: { member } })
    }
}