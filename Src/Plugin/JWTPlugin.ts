import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { CreateJWTUtils, JWTUtils } from "../Utils/JWTUtils";
export const JWTPlugin = async (app: FastifyInstance) => {
  await app.register(jwt, { secret: process.env.JWT_SECRET_KEY! });
  const jwtUtils = await CreateJWTUtils(app);
  app.decorate("jwtUtils", jwtUtils);
};
