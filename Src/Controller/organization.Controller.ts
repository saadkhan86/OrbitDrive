import { FastifyReply, FastifyRequest } from "fastify";
import { organizationService } from "../Services/organization.Service";
import {
  createOrganizationValidator,
  organizationIdValidator,
} from "../Validators/organization.Validator";
import OrganizationRepo from "../Repositories/Organization.Repo";
import { idValidator } from "../Validators/shared.Validator";

export const organizationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const organization = await organizationService.create(
      request.user.userId as idValidator,
      request.body as createOrganizationValidator,
    );
    return reply.code(201).send({
      success: true,
      message: "organization created successfully",
      data: { organization },
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationService.delete(
      request.user.userId as idValidator,
      (request.params as organizationIdValidator).id as idValidator,
    );
    reply
      .status(200)
      .send({ success: true, message: "organization deleted successfully" });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Organization updated successfully",
      data: {
        organization: await organizationService.update(
          request.user.userId as idValidator,
          (request.params as organizationIdValidator).id as idValidator,
          request.body as createOrganizationValidator,
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
          request.user.userId as idValidator,
          (request.params as organizationIdValidator).id as idValidator,
        ),
      },
    });
  },
  getAll: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "Organizations fetched successfully",
      data: {
        organizations: await organizationService.getAll(request.user.userId),
      },
    });
  },
};
