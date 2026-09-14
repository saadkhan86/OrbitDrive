import { FastifyReply, FastifyRequest } from "fastify";
import type { tokenValidator } from "../Validators/token.Validator";
import type { emailValidator } from "../Validators/email.Validator";
import { verificationService } from "../Services/verification.Service";

export const verificationController = {
  verifyEmailVerification: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await verificationService.verifyEmailVerification(
      request.params as tokenValidator,
    );
    return reply
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  },
  resendEmailVerification: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await verificationService.resendEmailVerification(
      (request.body as emailValidator).email,
    );
    return reply
      .status(201)
      .send({ success: true, message: "Verification email has been sent" });
  },
};
