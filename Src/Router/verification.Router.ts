import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { tokenValidator } from "../Validators/token.Validator";
import { verificationController } from "../Controller/verification.Controller";
import { emailValidator } from "../Validators/email.Validator";

export const verificationRouter = async (app: FastifyInstance) => {
  app.post(
    "/email-verification/resend",
    {
      schema: { body: emailValidator.emailSchema },
    },
    verificationController.resendEmailVerification,
  );
  app.get(
    "/email-verification:token",
    {
      schema: {
        params: tokenValidator.tokenSchema,
      },
    },
    verificationController.verifyEmailVerification,
  );
};
