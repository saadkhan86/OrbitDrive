import type { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "../Errors/CustomError";

export const authenticate = {
  user: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();

      if (!["access", "password-reset"].includes(request.user.type)) {
        throw new CustomError(
          401,
          "Invalid access token",
          "INVALID_ACCESS_TOKEN",
        );
      }
    } catch (error) {
      throw error;
    }
  },
};
