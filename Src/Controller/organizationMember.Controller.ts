import { FastifyRequest, FastifyReply } from "fastify";
import { organizationMemberService } from "../Services/organizationMember.Service";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const organizationMemberController = {
  getForCurrentUser: async (request: FastifyRequest, reply: FastifyReply) => {
    const organizations = await organizationMemberService.getForCurrentUser(request.user)
    reply.status(200).send({ success: true, message: "Organizations fetched for current user", data: { organizations } })
  },
  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const members = await organizationMemberService.query(request.params as VOrganizationMember.organizationId, request.query as VOrganizationMember.query)
    reply.status(200).send({
      success: true, message: "organizations fetched successfully", data: {
        result: members
      }
    })
  },
  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    const member = await organizationMemberService.getById(
      request.params as VOrganizationMember.memberId
    );
    return reply.status(200).send({
      success: true,
      message: "organization member fetched successfully",
      data: member,
    });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const organizationMember =
      await organizationMemberService.update(
        request.user as VAuth.userId,
        request.params as VOrganizationMember.memberId,
        request.body as VOrganizationMember.role,
      );
    return reply.status(200).send({
      success: true,
      message: "Organization Member updated successfully",
      data: organizationMember,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationMemberService.delete(
      request.user as VAuth.userId,
      request.params as VOrganizationMember.memberId,
    );
    return reply.status(200).send({
      success: true,
      message: "Organization Member deleted successfully",
    });
  },
};
