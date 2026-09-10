import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../Services/User.Service";
import type { SignupValidator } from "../Validators/UserValidator";

export const UserController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(201).send(await UserService.signup(request.body as SignupValidator));
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({ message: "Login route hit" });
  },
};
