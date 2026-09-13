import { FastifyReply, FastifyRequest } from "fastify";
import { VerificationService } from "../Services/Verification.Service";
import type { TokenValidator } from "../Validators/TokenValidator";
import type { EmailValidator } from "../Validators/EmailValidator";

export const VerificationController = {
  verifyEmail: async (request: FastifyRequest, reply: FastifyReply) => {
    await VerificationService.emailVerificationUpdate(
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
    await VerificationService.resendVerificationEmail(
      (request.body as EmailValidator).email,
    );
    return reply
      .status(201)
      .send({ success: true, message: "Verification email has been sent" });
  },
  sendPasswordResetEmail: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await VerificationService.sendPasswordResetEmail(
      (request.body as EmailValidator).email,
      (await request.server.jwtUtils).generatePasswordResetToken
    );
    return reply
      .status(201)
      .send({ success: true, message: "Password reset email has been sent" });
  },
};
