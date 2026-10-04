import { FastifyRequest, FastifyReply } from "fastify";
import { organizationMemberService } from "../Services/organizationMember.Service";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";

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
      request.user.userId as idValidator,
    );
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const organizationMember =
      await organizationMemberService.updateOrganizationMember(
        request.user.userId as idValidator,
        (request.params as organizationMemberOrganizationMemberIdValidator)
          .organizationId,
        (request.params as organizationMemberOrganizationMemberIdValidator)
          .organizationMemberId,
        request.body as organizationMemberRoleValidator,
      );
    return reply.status(200).send({
      success: true,
      message: "Organization Member updated successfully",
      data: organizationMember,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationMemberService.deleteOrganizationMember(
      request.user.userId as idValidator,
      (request.params as organizationMemberOrganizationMemberIdValidator)
        .organizationId,
      (request.params as organizationMemberOrganizationMemberIdValidator)
        .organizationMemberId,
    );
    return reply.status(200).send({
      success: true,
      message: "Organization Member deleted successfully",
    });
  },
};
