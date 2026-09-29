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
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
