import { FastifyReply, FastifyRequest } from "fastify";

export const clientController = {
  create: (request: FastifyRequest, reply: FastifyReply) => {
    return reply
      .status(201)
      .send({ success: true, message: "client created successfully",client: });
  },
  getById: () => {},
  getAll: () => {},
  update: () => {},
  delete: () => {},
};
