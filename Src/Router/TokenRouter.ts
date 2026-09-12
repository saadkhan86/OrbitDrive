import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenValidator } from "../Validators/TokenValidator";

export const TokenRouter = async (app: FastifyInstance) => {
  app.get(
    "/verify-email-token/:token",
    {
      schema: {
        params: TokenValidator.tokenSchema,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send({ message: "token received" });
    },
  );
};
