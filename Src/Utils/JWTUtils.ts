import { FastifyInstance } from "fastify";
import { UserIdInputValidator } from "../Validators/auth.Validator";

export const CreateJWTUtils = (app: FastifyInstance) => {
  return {
    generateAccessToken: (data: UserIdInputValidator) => {
      return app.jwt.sign(
        { userId: data.userId, type: "access" },
        { expiresIn: "1d" },
      );
    },
    generateRefreshToken: (data: UserIdInputValidator) => {
      return app.jwt.sign(
        { userId: data.userId, type: "refresh" },
        { expiresIn: "7d" },
      );
    },
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
