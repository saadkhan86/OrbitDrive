import { FastifyRequest, FastifyReply } from "fastify";
import { organizationService } from "../Services/organization.Service";
import { organizationController } from "./organization.Controller";

export const organizationMemberController = {
  getAllByOwnerId: async (request: FastifyRequest, reply: FastifyReply) => {
    // const organizationMembers = await organizationService.getAllByOwnerId(
    //   request.user.userId,
    // );
    // return reply.status(200).send({
    //   success: true,
    //   message: "organization members fetched successfully",
    //   data: { organizationMembers },
    // });
  },
  getByUserId: async (request: FastifyRequest, reply: FastifyReply) => {
    // return await (organizatio.getByUserId())
  },
  update: async (request: FastifyRequest, reply: FastifyReply) => {},
  remove: async (request: FastifyRequest, reply: FastifyReply) => {},
};
