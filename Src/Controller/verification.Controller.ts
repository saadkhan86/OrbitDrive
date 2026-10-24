import { FastifyReply, FastifyRequest } from "fastify";
import type { VVerification } from "../Validators/verification.Validator";
import { verificationService } from "../Services/verification.Service";
import { VToken } from "../Validators/token.Validator";

export const verificationController = {
  emailVerification: async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as VVerification.query;
    if (query.action === "resend-email") {
      await verificationService.resendEmailVerification({ ...query });
      return reply.status(201).send({ success: true, message: "Verification email has been sent" });
    }
    else if (query.action === "verify-email") {
      await verificationService.verifyEmailVerification({ ...query });
      return reply.status(200).send({ success: true, message: "Email verified successfully" });
    } else {
      return reply.status(400).send({ success: false, message: "Check your query parameters" })
    }
  }
};
