import { FastifyReply, FastifyRequest } from "fastify";
import { VAuth } from "../Auth/auth.validator";
import { VClient } from "./client.validator";
import { IReply } from "../../Interfaces/IReply";
import { clientService } from "./client.service";

export const clientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const client = await clientService.create(
      request.user as VAuth.userId,
      request.params as VClient.organizationId,
      request.body as VClient.create,
    )
    return reply.code(201).send({
      success: true,
      message: "client created successfully",
      data: {
        client
      },
    });
  },

  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const clients: IReply.queryReturn = await clientService.query(
      request.params as VClient.organizationId,
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
    const client = await clientService.getById(
      request.params as VClient.clientId,
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
    const client = await clientService.update(
      request.user as VAuth.userId,
      request.params as VClient.clientId,
      request.body as VClient.update,
    )
    return reply.code(200).send({
      success: true,
      message: "client updated successfully",
      data: {
        client
      },
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await clientService.delete(
      request.user as VAuth.userId,
      request.params as VClient.clientId,
    );

    return reply.code(200).send({
      success: true,
      message: "client deleted successfully",
    });
  },
};
