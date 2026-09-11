import jwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
export const JWTPlugin = (app: FastifyInstance) => {
  app.register(jwt, { secret: process.env.JWT_SECRET_KEY! });
};
