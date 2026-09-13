import type { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "../Errors/CustomError";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  if (request.user.type !== "access") {
    throw new CustomError(401, "invalid access token", "INVALID_ACCESS_TOKEN");
  }
}
