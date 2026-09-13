import type { FastifyInstance } from "fastify";
import { UserRouter } from "./UserRouter";
import { VerificationRouter } from "./VerificationRouter";

export const Router = async (app: FastifyInstance) => {
  app.register(UserRouter, { prefix: "/user" });
  app.register(VerificationRouter, { prefix: "/verification" });
};
