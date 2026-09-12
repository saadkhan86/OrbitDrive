import Fastify from "fastify";
import { responseTimeHook } from "./Hooks/responseTimeHook";
import { Router } from "./Router/Router";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { GlobalErrorHandler } from "./Errors/GlobalErrorHandler";
import { JWTPlugin } from "./Plugin/JWTPlugin";
import { StartServer } from "./Config/StartServer.Config";
import "dotenv/config";

const server = Fastify({
  logger: true,
});

server.register(responseTimeHook);
server.register(JWTPlugin);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler(GlobalErrorHandler);

server.get("/ping", async function (request, reply) {
  return {
    message: "pong",
  };
});

server.register(Router);

StartServer(server);
