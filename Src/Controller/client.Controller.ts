import { FastifyReply, FastifyRequest } from "fastify";

import clientsService from "../Services/clients.Service";
import {
  ClientIdParams,
  CreateClientInput,
  UpdateClientInput,
} from "../Validators/clients.Validator";
import { OrganizationIdInput } from "../Validators/organizationInvitation.Validator";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(201).send({
      success: true,
      message: "client created successfully",
      data: {
        client: await clientsService.create(
          (request.params as OrganizationIdInput).organizationId,
          request.body as CreateClientInput,
        ),
      },
    });
  },

  getAll: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      success: true,
      message: "clients fetched successfully",
      data: {
        clients: await clientsService.getAll(
          (request.params as OrganizationIdInput).organizationId,
        ),
      },
    });
  },

  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      success: true,
      message: "client fetched successfully",
      data: {
        client: await clientsService.getById(
          (request.params as ClientIdParams).organizationId,
          (request.params as ClientIdParams).clientId,
        ),
      },
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      success: true,
      message: "client updated successfully",
      data: {
        client: await clientsService.update(
          (request.params as ClientIdParams).organizationId,
          (request.params as ClientIdParams).clientId,
          request.body as UpdateClientInput,
        ),
      },
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await clientsService.delete(
      (request.params as ClientIdParams).organizationId,
      (request.params as ClientIdParams).clientId,
    );

    return reply.code(200).send({
      success: true,
      message: "client deleted successfully",
    });
  },
};
