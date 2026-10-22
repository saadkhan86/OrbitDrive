import type { FastifyReply, FastifyRequest } from "fastify";
import UserRepo from "../Repositories/User.Repo";
import { CustomError } from "../Errors/CustomError";

export const authenticate = {
  user: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payload = await request.jwtVerify<{ userId: string }>()
      const user = await UserRepo.findById({ userId: payload.userId })
      if (!user || !user.isEmailVerified) {
        throw new CustomError(404, 'User Not Found', 'USER_NOT_FOUND')
      }
      if (!user.refreshToken) {
        throw new CustomError(401, "Expired token", "EXPIRED_TOKEN")
      }
      request.user = {
        userId: user.id,
        email: user.email,
        type: "access"
      };
    } catch (error) {
      throw error;
    }
  },
};
