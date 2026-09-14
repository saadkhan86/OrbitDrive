import type { FastifyInstance } from "fastify";
import { userRouter } from "./user.Router";
import { authRouter } from "./auth.Router";
import { verificationRouter } from "./verification.Router";

export const router = async (app: FastifyInstance) => {
  app.register(authRouter, { prefix: "/auth" });
  app.register(userRouter, { prefix: "/user" });
  app.register(verificationRouter, { prefix: "/verification" });
};