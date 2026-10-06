import Fastify from "fastify";
import { ResponseTimeHook } from "./Hooks/ResponseTimeHook";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { GlobalErrorHandler } from "./Errors/GlobalErrorHandler";
import { JWTPlugin } from "./Plugin/JWTPlugin";
import { StartServer } from "./Config/StartServer.Config";
import "dotenv/config";
import cors from "@fastify/cors";
import { router } from "./Router/router";
import { shutdownServer } from "./Config/shutdownServer.Config";
import { swaggerConfig } from "./Config/swagger.Config";

const server = Fastify({
  logger: false,
});
swaggerConfig(server);
server.register(cors, { origin: "*" });
server.register(ResponseTimeHook);
server.register(JWTPlugin);
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler(GlobalErrorHandler);
server.get("/ping", async function (request, reply) {
  return {
    message: "pong",
  };
});
server.register(router, { prefix: "/api/v1" });
process.on("SIGINT", () => shutdownServer(server, "SIGINT"));
process.on("SIGTERM", () => shutdownServer(server, "SIGTERM"));
StartServer(server);
