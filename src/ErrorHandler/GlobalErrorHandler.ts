import { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "./CustomError";
import { DatabaseError } from "pg";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";

export const GlobalErrorHandler = (
  error: any,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log(error)
  if (error instanceof DrizzleQueryError) {
    request.log.error(
      { err: error },
      "-------------------------Drizzle error occurred---------------------",
    );
    if ((error.cause as any)?.code as string == "23505") {
      const match = (error.cause as any).detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
      return reply.code(400).send({
        success: false,
        error: {
          code: (error.cause as any).code as string,
          message: `The ${match[1]} already exists`,
        }
      });
    }
    if ((error.cause as any)?.code as string == "1048") {
      return reply.code(400).send({
        success: false,
        error: {
          cause: (error.cause as any).code as string,
          message: (error.cause as any).message,
        }
      });
    }
    return reply.code(500).send({
      success: false,
      error: {
        code: (error.cause as any).code,
        message: (error.cause as any).message as string
      }
    });
  }
  if (error instanceof DatabaseError) {
    request.log.error(
      { err: error },
      "-------------------------Database error occurred---------------------",
    );
    return reply.code(500).send({
      success: false,
      error: {
        code: error.code || "DATABASE_ERROR",
        message: error.message || "Database error",
      },
    });
  }
  if (error instanceof CustomError) {
    request.log.error(
      { err: error },
      "-----------------Custom error occurred-----------",
    );
    return reply.code(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }
  if (error.code?.startsWith("FST_JWT")) {
    request.log.error(
      { err: error },
      "-----------JWT error occurred----------",
    );
    return reply.code(error.statusCode || 401).send({
      success: false,
      error: {
        code: error.code || "JWT_ERROR",
        message: error.message || "Invalid or expired token",
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
  request.log.error(
    error,
    "-------------------Something went wrong------------",
  );
  return reply.code(error.statusCode || error.status || 500).send({
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Something went wrong",
    },
  });
};
