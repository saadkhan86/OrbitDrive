import type { FastifyReply, FastifyRequest } from "fastify";
import { organizationInvitationService } from "./organizationInvitation.service";
import { VAuth } from "../Auth/auth.validator";
import { VOrganizationInvitation } from "./organizationInvitation.validator";
import { IReply } from "../../Interfaces/IReply";

export const organizationInvitationController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await organizationInvitationService.create(
      request.user as VAuth.userId & VAuth.email,
      request.params as VOrganizationInvitation.organizationId,
      request.body as VOrganizationInvitation.create,
    );

    return reply.status(201).send({
      success: true,
      message: "Invitation created successfully",
      data: invitation,
    });
  },
  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitations: IReply.queryReturn =
      await organizationInvitationService.query(
        request.params as VOrganizationInvitation.organizationId,
        request.query as VOrganizationInvitation.query,
      );

    return reply.status(200).send({
      success: true,
      data: { result: invitations },
    });
  },
  getById: async (request: FastifyRequest, reply: FastifyReply) => {
    const invitation = await organizationInvitationService.getById(
      request.params as VOrganizationInvitation.invitationId,
    );
    return reply.status(200).send({
      success: true,
      message: "Organization fetched successfully",
      data: invitation,
    });
  },
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationInvitationService.delete(
      request.user as VAuth.userId,
      request.params as VOrganizationInvitation.invitationId,
    );

    return reply.status(200).send({
      success: true,
      message: "Invitation cancelled successfully",
    });
  },
  accept: async (request: FastifyRequest, reply: FastifyReply) => {
    await organizationInvitationService.accept(
      request.user as VAuth.userId & VAuth.email,
      request.params as VOrganizationInvitation.token,
    );
    return reply.status(200).send({
      success: true,
      message: "Invitation accepted successfully",
    });
  },
};
