import { FastifyReply, FastifyRequest } from "fastify";
import { EmailVerificationService } from "../Services/EmailVerification.Service";
import type { TokenValidator } from "../Validators/TokenValidator";
import type { EmailValidator } from "../Validators/EmailValidator";

export const TokenController = {
  verifyEmail: async (request: FastifyRequest, reply: FastifyReply) => {
    await EmailVerificationService.emailVerificationUpdate(
      request.params as TokenValidator,
    );
    return reply
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  },
  resendVerificationEmail: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await EmailVerificationService.resendVerificationEmail(
      (request.body as EmailValidator).email,
    );
    return reply
      .status(200)
      .send({ success: true, message: "Verification email has been sent" });
  },
};
