import { FastifyRequest, FastifyReply } from "fastify";
import { organizationMemberService } from "../Services/organizationMember.Service";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const organizationMemberController = {
  getAllByOrganizationId: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const organizationMembers =
      await organizationMemberService.getAllByOrganizationId(
        request.params as VOrganizationMember.organizationId,
      );
    return reply.status(200).send({
      success: true,
      message: "organization members fetched successfully",
      data: { organizationMembers },
    });
  },
  getByUserId: async (request: FastifyRequest, reply: FastifyReply) => {
    return await organizationMemberService.getByUserId(
      request.user as VAuth.userId,
    );
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const organizationMember =
      await organizationMemberService.updateOrganizationMember(
        request.user as VAuth.userId,
        request.params as VOrganizationMember.organizationMemberId,
        request.body as VOrganizationMember.role,
      );
    return reply.status(200).send({
      success: true,
      message: "Organization Member updated successfully",
      data: organizationMember,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationMemberService.deleteOrganizationMember(
      request.user as VAuth.userId,
      request.params as VOrganizationMember.organizationMemberId,
    );
    return reply.status(200).send({
      success: true,
      message: "Organization Member deleted successfully",
    });
  },
};
