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
  passwordReset: async (request: FastifyRequest, reply: FastifyReply) => {
    const { token } = request.params as { token: string };
    const { password } = request.body as { password: string };
    const userId = request.server.jwtUtils.verifyPasswordResetToken(token).id;
    await UserService.passwordReset(userId, { password });
    return reply.status(200).send({ message: "Password reset successfully" });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    //   const userId = request.user?.id;
    //   const user = await UserService.update(
    //     userId,
    //     request.body as UpdateValidator,
    //   );
    return reply.status(200).send({ message: "User updated successfully" });
  },
};
