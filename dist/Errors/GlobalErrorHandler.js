"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const CustomError_1 = require("./CustomError");
const pg_1 = require("pg");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const GlobalErrorHandler = (error, request, reply) => {
    if (error instanceof pg_1.DatabaseError) {
        request.log.error({ err: error }, "Database error occurred");
        return reply.code(500).send({
            success: false,
            error: {
                code: "DATABASE_ERROR",
                message: "Database error",
            },
        });
    }
    if (error instanceof CustomError_1.CustomError) {
        request.log.error({ err: error }, "Custom error occurred");
        return reply.code(error.statusCode).send({
            success: false,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    }
    if ((0, fastify_type_provider_zod_1.hasZodFastifySchemaValidationErrors)(error)) {
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
exports.GlobalErrorHandler = GlobalErrorHandler;
//# sourceMappingURL=GlobalErrorHandler.js.map