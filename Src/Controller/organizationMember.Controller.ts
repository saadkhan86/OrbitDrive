import { FastifyRequest, FastifyReply } from "fastify";
import { organizationMemberService } from "../Services/organizationMember.Service";
import {
  organizationMemberOrganizationIdValidator,
  organizationMemberOrganizationMemberIdValidator,
  organizationMemberRoleValidator,
} from "../Validators/organizationMember.Validator";
import { idValidator } from "../Validators/shared.Validator";

export const organizationMemberController = {
  getAllByOrganizationId: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const organizationMembers =
      await organizationMemberService.getAllByOrganizationId(
        (request.params as organizationMemberOrganizationIdValidator)
          .organizationId,
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
        (request.params as organizationMemberOrganizationMemberIdValidator)
          .organizationMemberId,
        (request.params as organizationMemberOrganizationMemberIdValidator)
          .organizationId,
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
      (request.params as organizationMemberOrganizationMemberIdValidator)
        .organizationId,
      (request.params as organizationMemberOrganizationMemberIdValidator)
        .organizationMemberId,
    );
    return reply
      .status(200)
      .send({
        success: true,
        message: "Organization Member deleted successfully",
      });
  },
};
