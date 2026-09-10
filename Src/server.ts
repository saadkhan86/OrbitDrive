import Fastify from "fastify";
import { responseTimeHook } from "./Hooks/responseTimeHook";
import { Router } from "./Router/Router";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { checkDatabaseConnection } from "./Database";
import { CustomError } from "./Errors/CustomError";
import { config } from "dotenv";
import { GlobalErrorHandler } from "./Errors/GlobalErrorHandler";

config();

const server = Fastify({
  logger: true,
});

server.register(responseTimeHook);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler(GlobalErrorHandler);

server.get("/ping", function (request, reply) {
  return {
    message: "pong",
  };
});

server.register(Router);

checkDatabaseConnection().then(() => {
  server.listen({ port: 8080 }, (error, port) => {
    if (error) {
      server.log.error(`An error occurred: ${error.message}`);
      process.exit(1);
    }

    console.log(`🚀 Server running on ${port}`);
  });
});
