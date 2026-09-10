import { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "./CustomError";
import { DatabaseError } from "pg";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export const GlobalErrorHandler = (
  error: any,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof DatabaseError) {
    request.log.error({ err: error }, "Database error occurred");
    return reply.code(500).send({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Database error",
      },
    });
  }
  if (error instanceof CustomError) {
    request.log.error({ err: error }, "Custom error occurred");
    return reply.code(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }
  if (hasZodFastifySchemaValidationErrors(error)) {
    request.log.error({ err: error }, "Zod validation error");
    return reply.code(error.statusCode || 400).send({
      success: false,
      error: {
        code: error.code || "Validation_ERROR",
        message: error.message || "double check your passed data",
      },
    });
  }

  request.log.error("Something went wrong", error);
  return reply.code(500).send({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};
