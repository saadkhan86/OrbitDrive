import { FastifyReply, FastifyRequest } from "fastify";
import { invitationService } from "../Services/invitation.Service";

export const invitationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await invitationService.create(23);
    reply.status(201).send({
      success: true,
      message: "Invitation created successfully",
      data: { invitation },
    });
  },
  get: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await invitationService.get(23);
    reply.status(200).send({
      success: true,
      message: "Invitation fetched successfully",
      data: { invitation },
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await invitationService.delete(23);
    reply.status(200).send({
      success: true,
      message: "Invitation deleted successfully",
      data: { invitation },
    });
  },
  claim: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await invitationService.claim(23);
    reply.status(200).send({
      success: true,
      message: "Invitation claimed successfully",
      data: { invitation },
    });
  },
};
