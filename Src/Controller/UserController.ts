import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../Services/User.Service";
import type {
  LoginValidator,
  SignupValidator,
} from "../Validators/UserValidator";

export const UserController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(201).send({
      message: "User created successfully",
      user: await UserService.signup(request.body as SignupValidator),
    });
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      message: "User logged in successfully",
      user: await UserService.login(request.body as LoginValidator),
    });
  },
};
