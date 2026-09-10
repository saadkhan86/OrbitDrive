import type { FastifyInstance } from "fastify";
import { UserRouter } from "./UserRouter";

export async function Router(app: FastifyInstance) {
  app.register(UserRouter, { prefix: "/api/v1/user" });
}