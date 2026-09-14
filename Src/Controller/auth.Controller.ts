import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../Services/auth.Service";
import {
  loginValidator,
  passwordResetValidator,
  signupValidator,
} from "../Validators/user.Validator";
import { emailValidator } from "../Validators/email.Validator";

export const authController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.signup(request.body as signupValidator);
    return reply.status(201).send({
      message:
        "Account created successfully!, Check your email for verification",
    });
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      message: "User logged in successfully",
      user: await authService.login(request.body as loginValidator),
    });
  },
  forgotPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.forgotPassword(
      (request.body as emailValidator).email,
      request.server.jwtUtils.generatePasswordResetToken,
    );
    return reply
      .status(201)
      .send({ success: true, message: "Password reset email has been sent" });
  },
  passwordReset: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.passwordReset(request.user.userId, {
      password: (request.body as passwordResetValidator).password,
    });
    return reply.status(200).send({ message: "Password reset successfully" });
  },
};
