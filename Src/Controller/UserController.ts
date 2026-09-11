import type { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../Services/User.Service";
import type {
  LoginValidator,
  SignupValidator,
  UpdateValidator,
} from "../Validators/UserValidator";

export const UserController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    await UserService.signup(request.body as SignupValidator);
    return reply.status(201).send({
      message:
        "Account created successfully!, Check your email for verification",
    });
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      message: "User logged in successfully",
      user: await UserService.login(request.body as LoginValidator),
    });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    // const { fullName } = request.body as UpdateValidator;
    // if (!fullName || fullName == undefined || fullName == null)
    //   return reply
    //     .status(200)
    //     .send({ message: "user updated successfully", data: request.user! });
    const user = await UserService.update(request.body as UpdateValidator);
    return reply
      .status(200)
      .send({ message: "User updated successfully", user });
  },
};
