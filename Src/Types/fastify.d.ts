import type { JWTUtils } from "../Utils/JWT.utils";

declare module "fastify" {
  interface FastifyInstance {
    jwtUtils: JWTUtils;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      type: "access" | "refresh";
    };

    user: {
      userId: string;
      email: string;
      type: "access" | "refresh";
    };
  }
}
