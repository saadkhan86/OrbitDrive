import { FastifyReply, FastifyRequest } from "fastify";

import clientsService from "../Services/clients.Service";
import { VOrganization } from "../Validators/organization.Validator";
import { VClient } from "../Validators/clients.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(201).send({
      success: true,
      message: "client created successfully",
      data: {
        client: await clientsService.create(
          request.user as VAuth.userId,
          request.params as VClient.OrganizationIdParams,
          request.body as VClient.CreateClientInput,
        ),
      },
    });
  },

  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const clients = await clientsService.query(
      request.params as VOrganization.getById,
      request.query as VClient.query
    )
    return reply.code(200).send({
      success: true,
      message: "clients fetched successfully",
      data: {
        result: clients
      },
    });
  },

  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    const client = await clientsService.getById(
      request.params as VClient.ClientIdParams,
    )
    return reply.code(200).send({
      success: true,
      message: "client fetched successfully",
      data: {
        client
      },
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
      success: true,
      message: "client updated successfully",
      data: {
        client: await clientsService.update(
          request.user as VAuth.userId,
          request.params as VClient.ClientIdParams,
          request.body as VClient.UpdateClientInput,
        ),
      },
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await clientsService.delete(
      request.user as VAuth.userId,
      request.params as VClient.ClientIdParams,
    );

    return reply.code(204).send({
      success: true,
      message: "client deleted successfully",
    });
  },
};
