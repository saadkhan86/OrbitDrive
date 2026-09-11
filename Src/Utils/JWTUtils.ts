import { FastifyInstance } from "fastify";

export const CreateJWTUtils = async (app: FastifyInstance) => {
  return {
    generateAccessToken: (id: string) => {
      return app.jwt.sign({ id: id, type: "access" }, { expiresIn: "12h" });
    },
    generateRefreshToken: (id: string) => {
      return app.jwt.sign({ id: id, type: "refresh" }, { expiresIn: "30d" });
    },
  };
};
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
