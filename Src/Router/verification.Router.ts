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
      schema: { querystring: verificationValidator.query },
    },
    verificationController.emailVerification,
  );
};
