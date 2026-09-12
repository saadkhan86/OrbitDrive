import type { FastifyInstance } from "fastify";
import { UserRouter } from "./UserRouter";
import { TokenRouter } from "./TokenRouter";

export const Router = async (app: FastifyInstance) => {
  app.register(UserRouter, { prefix: "/user" });
  app.register(TokenRouter, { prefix: "/token" });
};
