import { FastifyInstance } from "fastify";
import { Constants } from "../Constants/Constants";

export const CreateJWTUtils = async (app: FastifyInstance) => {
  return {
    generateAccessToken: (id: string) => {
      return app.jwt.sign({ id: id, type: "access" }, { expiresIn: "12h" });
    },
    generateRefreshToken: (id: string) => {
      return app.jwt.sign({ id: id, type: "refresh" }, { expiresIn: "30d" });
    },
    generatePasswordResetToken: (id: string) => {
      return app.jwt.sign(
        { id, type: "password-reset" },
        { expiresIn: `${Constants.tokenExpireTime}m` },
      );
    },
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
