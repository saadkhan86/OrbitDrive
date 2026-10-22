import type { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../Services/user.Service";
import { VAuth } from "../Validators/auth.Validator";
import { request } from "http";

export const userController = {
  me: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      success: true,
      message: "profile fetched successfully",
      data: { user: await userService.me(request.user) },
    });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: "User updated successfully",
      data: {
        user: await userService.update(
          request.user,
          request.body as VAuth.update,
        ),
      },
    });
  },
  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("logout")
    await userService.logout(request.user)
    return reply.status(200).send({
      success: true,
      message: "logout successfull"
    })
  }
};
