import { FastifyReply, FastifyRequest } from "fastify";

import clientsService from "../Services/clients.Service";
import {
  CreateClientInput,
  UpdateClientInput,
} from "../Validators/clients.Validator";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const client = await clientsService.create(
      organizationId,
      request.body as CreateClientInput,
    );

    return reply.code(201).send({
      success: true,
      data: client,
    });
  },

  getAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const clients = await clientsService.getAll(organizationId);

    return reply.code(200).send({
      success: true,
      data: clients,
    });
  },

  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, clientId } = request.params as {
      organizationId: string;
      clientId: string;
    };

    const client = await clientsService.getById(organizationId, clientId);

    return reply.code(200).send({
      success: true,
      data: client,
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, clientId } = request.params as {
      organizationId: string;
      clientId: string;
    };

    const client = await clientsService.update(
      organizationId,
      clientId,
      request.body as UpdateClientInput,
    );

    return reply.code(200).send({
      success: true,
      data: client,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, clientId } = request.params as {
      organizationId: string;
      clientId: string;
    };

    const result = await clientsService.delete(organizationId, clientId);

    return reply.code(200).send({
      success: true,
      data: result,
    });
  },
};
