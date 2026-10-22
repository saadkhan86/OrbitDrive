import { FastifyInstance } from "fastify";
import { VAuth } from "../Validators/auth.Validator";

export const CreateJWTUtils = (app: FastifyInstance) => {
  return {
    generateAccessToken: (data: VAuth.userId) => {
      return app.jwt.sign(
        { userId: data.userId, type: "access" },
        { expiresIn: "1d" },
      );
    },
    generateRefreshToken: (data: VAuth.userId) => {
      return app.jwt.sign(
        { userId: data.userId, type: "refresh" },
        { expiresIn: "7d" },
      );
    },
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
