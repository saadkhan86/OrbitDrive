import { FastifyReply, FastifyRequest } from "fastify";
import type { tokenValidator, VToken } from "../Validators/token.Validator";
import { verificationService } from "../Services/verification.Service";
import { VAuth } from "../Validators/auth.Validator";

export const verificationController = {
  resendEmailVerification: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await verificationService.resendEmailVerification(
      request.body as VAuth.email,
    );
    return reply
      .status(201)
      .send({ success: true, message: "Verification email has been sent" });
  },
  verifyEmailVerification: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await verificationService.verifyEmailVerification(
      request.params as VToken.token,
    );
    return reply
      .status(204)
      .send({ success: true, message: "Email verified successfully" });
  },
};
