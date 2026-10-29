import { FastifyInstance } from "fastify";
import { verificationController } from "../Controller/verification.Controller";
import { verificationValidator } from "../Validators/verification.Validator";

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
