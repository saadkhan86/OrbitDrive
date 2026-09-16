import { FastifyReply, FastifyRequest } from "fastify";
import { organizationService } from "../Services/organization.Service";
import { createOrganizationValidator } from "../Validators/organization.Validator";
import OrganizationRepo from "../Repositories/Organization.Repo";
import { idValidator } from "../Validators/shared.Validator";

export const organizationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const organization = await organizationService.create(
      request.user.userId,
      request.body as createOrganizationValidator,
    );
    return reply.code(201).send({
      success: true,
      message: "organization created successfully",
      data: { organization },
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationService.delete(request.params.id as idValidator);
    reply
      .status(200)
      .send({ success: true, message: "organization deleted successfully" });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {},
  getById: async (request: FastifyRequest, reply: FastifyReply) => {},
  getAll: async (request: FastifyRequest, reply: FastifyReply) => {},
};
