import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TokenValidator } from "../Validators/TokenValidator";
import { TokenController } from "../Controller/TokenController";
import { EmailValidator } from "../Validators/EmailValidator";

export const TokenRouter = async (app: FastifyInstance) => {
  app.get(
    "/verify-email-token/:token",
    {
      schema: {
        params: TokenValidator.tokenSchema,
      },
    },
    TokenController.verifyEmail,
  );
  app.post(
    "/resend-verification-email",
    {
      schema: { body: EmailValidator.emailSchema },
    },
    TokenController.resendVerificationEmail,
  );
};
