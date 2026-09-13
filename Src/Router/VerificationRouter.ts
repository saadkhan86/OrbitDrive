import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenValidator } from "../Validators/TokenValidator";
import { VerificationController } from "../Controller/VerificationController";
import { EmailValidator } from "../Validators/EmailValidator";

export const VerificationRouter = async (app: FastifyInstance) => {
  app.get(
    "/email-verification/:token",
    {
      schema: {
        params: TokenValidator.tokenSchema,
      },
    },
    VerificationController.verifyEmail,
  );
  app.post(
    "/resend-verification-email",
    {
      schema: { body: EmailValidator.emailSchema },
    },
    VerificationController.resendVerificationEmail,
  );
  app.post(
    "/password-reset",
    {
      schema: { body: EmailValidator.emailSchema },
    },
    VerificationController.sendPasswordResetEmail,
  );
};
