import { JWTUtils } from "../Utils/JWTUtils";

declare module "fastify" {
  interface FastifyInstance {
    jwtUtils: JWTUtils;
  }
}
