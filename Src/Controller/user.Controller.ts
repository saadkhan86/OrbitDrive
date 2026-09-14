import type { FastifyReply, FastifyRequest } from "fastify";
import { userService } from "../Services/user.Service";
import type { updateValidator } from "../Validators/user.Validator";

export const userController = {
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await userService.update(
      request.user.userId,
      request.body as updateValidator,
    );
    return reply
      .status(200)
      .send({ message: "User updated successfully", user });
  },
};
