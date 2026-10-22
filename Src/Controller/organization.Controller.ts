import { FastifyReply, FastifyRequest } from "fastify";
import { organizationService } from "../Services/organization.Service";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganization } from "../Validators/organization.Validator";

export const organizationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(201).send({
      success: true,
      message: "organization created successfully",
      data: {
        organization: await organizationService.create(
          request.user as VAuth.userId,
          request.body as VOrganization.create,
        ),
      },
    });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Organization updated successfully",
      data: {
        organization: await organizationService.update(
          request.user as VAuth.userId,
          request.params as VOrganization.getById,
          request.body as VOrganization.update,
        ),
      },
    });
  },
  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Organization fetched successfully",
      data: {
        organization: await organizationService.getById(
          request.user as VAuth.userId,
          request.params as VOrganization.getById,
        ),
      },
    });
  },
  getAllByOwnerId: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Organizations fetched successfully",
      data: {
        organizations: await organizationService.getAllByOwnerId(
          request.user as VAuth.userId,
        ),
      },
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationService.delete(
      request.user as VAuth.userId,
      request.params as VOrganization.getById,
    );
    reply
      .status(204)
      .send({ success: true, message: "organization deleted successfully" });
  },
};
