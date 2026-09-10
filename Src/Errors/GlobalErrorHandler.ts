import { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "./CustomError";
import { DatabaseError } from "pg";

export const GlobalErrorHandler = (
  error: any,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof DatabaseError) {
    return reply.code(500).send({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database error",
      },
    });
  }
  if (error instanceof CustomError) {
    return reply.code(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }
  request.log.error(error);

  return reply.code(500).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};
