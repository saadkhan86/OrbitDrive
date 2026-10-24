import type { FastifyReply, FastifyRequest } from "fastify";

import { organizationInvitationService } from "../Services/organizationInvitation.Service";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";

export const organizationInvitationController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { invitation } = await organizationInvitationService.create(
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

  async query(request: FastifyRequest, reply: FastifyReply) {
    const invitations =
      await organizationInvitationService.query(
        request.params as VOrganizationInvitation.organizationId,
        request.query as VOrganizationInvitation.query,
      );

    return reply.status(200).send({
      success: true,
      data: { result: invitations },
    });
  },
  async getById(request: FastifyRequest, reply: FastifyReply) {
    const invitation = await organizationInvitationService.getById(
      request.params as VOrganizationInvitation.invitationId,
    );
    return reply.status(200).send({
      success: true,
      data: invitation,
    });
  },

  // DELETE /organizations/:organizationId/invitations/:invitationId
  async delete(request: FastifyRequest, reply: FastifyReply) {
    await organizationInvitationService.delete(
      request.user as VAuth.userId,
      request.params as VOrganizationInvitation.invitationId,
    );

    return reply.status(200).send({
      success: true,
      message: "Invitation cancelled successfully",
    });
  },

  // POST /invitations/accept
  async accept(request: FastifyRequest, reply: FastifyReply) {
    await organizationInvitationService.accept(
      request.user as VAuth.userId & VAuth.email,
      request.params as VOrganizationInvitation.token,
    );
    return reply.status(204).send({
      success: true,
      message: "Invitation accepted successfully",
    });
  },
};
