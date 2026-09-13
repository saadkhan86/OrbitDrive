import type { JWTUtils } from "../Utils/JWTUtils";

declare module "fastify" {
  interface FastifyInstance {
    jwtUtils: JWTUtils;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      type: "access" | "refresh" | "password-reset";
    };

    user: {
      userId: string;
      type: "access" | "refresh" | "password-reset";
    };
  }
}
