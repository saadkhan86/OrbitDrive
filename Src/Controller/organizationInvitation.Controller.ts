import type { FastifyReply, FastifyRequest } from "fastify";

import { organizationInvitationService } from "../Services/organizationInvitation.Service";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";

export const organizationInvitationController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const result = await organizationInvitationService.create(
      request.user as VAuth.userId & VAuth.email,
      request.params as VOrganizationInvitation.organizationId,
      request.body as VOrganizationInvitation.create,
    );

    return reply.status(201).send({
      success: true,
      message: "Invitation created successfully",
      data: result.invitation,
    });
  },

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const invitations =
      await organizationInvitationService.getAllByOrganizationId(
        request.params as VOrganizationInvitation.organizationId,
      );

    return reply.status(200).send({
      success: true,
      data: invitations,
    });
  },

  // DELETE /organizations/:organizationId/invitations/:invitationId
  async delete(request: FastifyRequest, reply: FastifyReply) {
    await organizationInvitationService.delete(
      request.params as VOrganizationInvitation.invitationId,
    );

    return reply.status(200).send({
      success: true,
      message: "Invitation cancelled successfully",
    });
  },

  // POST /invitations/accept
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const member = await organizationInvitationService.accept(
      request.params as VOrganizationInvitation.token,
      request.user as VAuth.userId & VAuth.email,
    );
    return reply.status(204).send({
      success: true,
      message: "Invitation accepted successfully",
      data: member,
    });
  },
};
