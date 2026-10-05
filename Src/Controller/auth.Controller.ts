import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../Services/auth.Service";
import { VAuth } from "../Validators/auth.Validator";

export const authController = {
  signup: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.signup(request.body as VAuth.create);
    return reply.status(201).send({
      success: true,
      message:
        "Account created successfully!, Check your email for verification",
    });
  },
  login: async (request: FastifyRequest, reply: FastifyReply) => {
    const { user, refreshToken } = await authService.login(
      request.body as VAuth.login,
    );
    const accessToken = request.server.jwtUtils.generateAccessToken({
      userId: user.id,
    } as VAuth.userId);
    return reply.status(200).send({
      success: true,
      message: "User logged in successfully",
      data: {
        tokens: { accessToken, refreshToken },
        user: { id: user.id, fullName: user.fullName, email: user.email },
      },
    });
  },
  forgotPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.forgotPassword(request.body as VAuth.email);
    return reply
      .status(201)
      .send({ success: true, message: "Password reset email has been sent" });
  },
  passwordReset: async (request: FastifyRequest, reply: FastifyReply) => {
    await authService.passwordReset(request.body as VAuth.passwordReset);
    return reply
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  },
  refresh: async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken, userId } = await authService.refresh(
      request.body as VAuth.refreshToken,
    );
    const accessToken = request.server.jwtUtils.generateAccessToken({
      userId,
    } as VAuth.userId);
    return reply.status(200).send({
      success: true,
      message: "Token refreshed successfully",
      data: { tokens: { refreshToken, accessToken } },
    });
  },
};
