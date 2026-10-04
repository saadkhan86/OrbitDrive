import type { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "../Errors/CustomError";
import UserRepo from "../Repositories/User.Repo";

export const authenticate = {
  user: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await UserRepo.findByEmail({ email: "sk8613013@gmail.com" });
      if (!user) {
        throw new CustomError(401, "User not found", "USER_NOT_FOUND");
      }
      if (!user.isEmailVerified) {
        throw new CustomError(403, "Email not verified", "EMAIL_NOT_VERIFIED");
      }
      request.user = { type: "access", userId: user.id, email: user.email };
    } catch (error) {
      throw error;
    }
  },
};
