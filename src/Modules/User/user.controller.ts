import type { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "./user.service";
import { VUser } from "./user.validator";

export const userController = {
  me: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userService.me(request.user)
    reply.status(200).send({
      success: true,
      message: "profile fetched successfully",
      data: { user },
    });
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userService.update(
      request.user,
      request.body as VUser.update,
    )
    return reply.status(200).send({
      success: true,
      message: "User updated successfully",
      data: {
        user,
      },
    });
  },
  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    await userService.logout(request.user)
    return reply.status(200).send({
      success: true,
      message: "logout successfull"
    })
  },
  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await userService.query(request.query as VUser.query)
    return reply.status(200).send({
      success: true,
      message: "users fetched successfully",
      data: { result: users },
    });
  }
};
