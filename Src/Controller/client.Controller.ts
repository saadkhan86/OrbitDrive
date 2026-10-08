import { FastifyReply, FastifyRequest } from "fastify";

import clientsService from "../Services/clients.Service";
import { VOrganization } from "../Validators/organization.Validator";
import { VClient } from "../Validators/clients.Validator";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(201).send({
      success: true,
      message: "client created successfully",
      data: {
        client: await clientsService.create(
          (request.params as VOrganization.getById).organizationId,
          request.body as VClient.CreateClientInput,
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
          request.params as VOrganization.getById,
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
          request.params as VClient.ClientIdParams,
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
          request.params as VClient.ClientIdParams,
          request.body as VClient.UpdateClientInput,
        ),
      },
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await clientsService.delete(request.params as VClient.ClientIdParams);

    return reply.code(204).send({
      success: true,
      message: "client deleted successfully",
    });
  },
};
