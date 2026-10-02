import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../Services/auth.Service";
import {
  emailInputValidator,
  loginInputValidator,
  passwordResetInputValidator,
  signupInputValidator,
} from "../Validators/auth.Validator";

import type { refreshTokenValidator } from "../Validators/token.Validator";

export const authController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.signup(request.body as signupInputValidator);
    return reply.status(201).send({
      success: true,
      message:
        "Account created successfully!, Check your email for verification",
    });
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    const { userId, refreshToken } = await authService.login(
      request.body as loginInputValidator,
    );
    const accessToken = request.server.jwtUtils.generateAccessToken(userId);
    return reply.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: { tokens: { accessToken, refreshToken } },
    });
  },
  forgotPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.forgotPassword(request.body as emailInputValidator);
    return reply
      .status(201)
      .send({ success: true, message: "Password reset email has been sent" });
  },
  passwordReset: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.passwordReset(
      request.body as passwordResetInputValidator,
    );
    return reply
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  },
  refresh: async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken, userId } = await authService.refresh(
      (request.query as refreshTokenValidator).token,
    );
    const accessToken = request.server.jwtUtils.generateAccessToken(userId);
    return reply.status(200).send({
      success: true,
      message: "Token refreshed successfully",
      data: { tokens: { refreshToken, accessToken } },
    });
  },
};
