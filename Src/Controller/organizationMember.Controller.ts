import { FastifyRequest, FastifyReply } from "fastify";
import { organizationMemberService } from "../Services/organizationMember.Service";
import { idValidator } from "../Validators/shared.Validator";

type OrgIdParams = { organizationId: idValidator };

export const organizationMemberController = {
  getAllByOwnerId: async (
    request: FastifyRequest<{ Params: OrgIdParams }>,
    reply: FastifyReply,
  ) => {
    const organizationMembers =
      await organizationMemberService.getAllByOrganizationId(
        request.params.organizationId,
      );
    return reply.status(200).send({
      success: true,
      message: "organization members fetched successfully",
      data: { organizationMembers },
    });
  },
  getByUserId: async (request: FastifyRequest, reply: FastifyReply) => {
    return await organizatio.getByUserId();
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {},
  delete: async (request: FastifyRequest, reply: FastifyReply) => {},
};
