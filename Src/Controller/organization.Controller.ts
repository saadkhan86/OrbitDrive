import { FastifyReply, FastifyRequest } from "fastify";
import { organizationService } from "../Services/organization.Service";

import {
  CreateOrganizationInputValidator,
  OrganizationIdInputValidator,
  OrganizationUpdateInputValidator,
} from "../Validators/organization.Validator";
import { UserIdInputValidator } from "../Validators/auth.Validator";

export const organizationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(201).send({
      success: true,
      message: "organization created successfully",
      data: {
        organization: await organizationService.create(
          request.user as UserIdInputValidator,
          request.body as CreateOrganizationInputValidator,
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
          request.user as UserIdInputValidator,
          request.params as OrganizationIdInputValidator,
          request.body as OrganizationUpdateInputValidator,
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
          request.user as UserIdInputValidator,
          request.params as OrganizationIdInputValidator,
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
          request.user as UserIdInputValidator,
        ),
      },
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationService.delete(
      request.user as UserIdInputValidator,
      request.params as OrganizationIdInputValidator,
    );
    reply
      .status(200)
      .send({ success: true, message: "organization deleted successfully" });
  },
};
