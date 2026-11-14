import { FastifyInstance } from "fastify";
import { verificationValidator } from "./verification.validator";
import { verificationController } from "./verification.controller";

export const verificationRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["verification"] };
  });
  app.post(
    "/email-verification",
    {
      config: { rateLimit: { max: 5, timeWindow: "10 minutes" } },
      schema: { querystring: verificationValidator.query },
    },
    verificationController.emailVerification,
  );
};
