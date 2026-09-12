import { FastifyReply, FastifyRequest } from "fastify";
import { EmailVerificationService } from "../Services/EmailVerification.Service";
import type { TokenValidator } from "../Validators/TokenValidator";

export const TokenController = {
  verifyEmail: async (request: FastifyRequest, reply: FastifyReply) => {
    const verification = await EmailVerificationService.emailVerification(
      request.params as TokenValidator,
    );
    return reply
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  },
};
