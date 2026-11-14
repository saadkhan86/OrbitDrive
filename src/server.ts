import Fastify from "fastify";
import { ResponseTimeHook } from "./Hooks/responseTime.hook";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { GlobalErrorHandler } from "./ErrorHandler/GlobalErrorHandler";
import { JWTPlugin } from "./Plugin/JWT.plugin";
import { startServer } from "./Config/startServer.config";
import "dotenv/config";
import cors from "@fastify/cors";
import { router } from "./Router/router";
import { shutdownServer } from "./Config/shutdownServer.config";
import { swaggerConfig } from "./Config/swagger.config";
import rateLimit from "@fastify/rate-limit";
import { SocketServer } from "./Socket/server.socket";

const server = Fastify({
  logger: false,
});

swaggerConfig(server);

server.register(cors, {
  origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

});

server.register(ResponseTimeHook);
server.register(JWTPlugin);
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler(GlobalErrorHandler);

server.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
});

server.register(router, { prefix: "/api/v1" });

SocketServer(server)

process.on("SIGINT", () => shutdownServer(server, "SIGINT"));
process.on("SIGTERM", () => shutdownServer(server, "SIGTERM"));
startServer(server);
