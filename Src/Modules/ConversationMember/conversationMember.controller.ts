import { FastifyReply, FastifyRequest } from "fastify";
import { conversationMemberService } from "./conversationMember.service";
import { VConversationMember } from "./conversationMember.validator";
import { IReply } from "../../Interfaces/IReply";

export const conversationMemberController = {
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const members: IReply.queryReturn = await conversationMemberService.query(request.params as VConversationMember.conversationId, request.query as VConversationMember.query)
        reply.status(200).send({ success: true, message: "members fetched successfully", data: { members } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const member = await conversationMemberService.update(request.user, request.params as VConversationMember.conversationId, request.body as VConversationMember.update)
        reply.status(200).send({ success: true, message: "Member updated successfully", data: { member } })
    }
}