import { FastifyInstance } from "fastify";
import { Constants } from "../Constants/Constants";

export const CreateJWTUtils = (app: FastifyInstance) => {
  return {
    generateAccessToken: (id: string) => {
      return app.jwt.sign({ userId: id, type: "access" }, { expiresIn: "1d" });
    },
    generateRefreshToken: (id: string) => {
      return app.jwt.sign({ userId: id, type: "refresh" }, { expiresIn: "7d" });
    },
    generatePasswordResetToken: (id: string) => {
      return app.jwt.sign(
        { userId: id, type: "password-reset" },
        { expiresIn: `${Constants.tokenExpireTime}m` },
      );
    },
    verifyPasswordResetToken: (token: string) => {
      return app.jwt.verify<{ id: string; type: "password-reset" }>(token);
    },
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
