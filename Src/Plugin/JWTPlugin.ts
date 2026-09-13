import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { CreateJWTUtils } from "../Utils/JWTUtils";

const jwtPlugin = async (app: FastifyInstance) => {
  await app.register(jwt, { secret: process.env.JWT_SECRET_KEY! });
  app.decorate("jwtUtils", CreateJWTUtils(app));
};

export const JWTPlugin = fp(jwtPlugin);
