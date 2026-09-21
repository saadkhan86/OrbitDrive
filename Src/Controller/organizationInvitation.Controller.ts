import type { FastifyReply, FastifyRequest } from "fastify";

import { organizationInvitationService } from "../Services/organizationInvitation.Service";

import type {
  OrganizationInvitationCreateInput,
  OrganizationInvitationAcceptInput,
} from "../Validators/organizationInvitation.Validator";
import UserRepo from "../Repositories/User.Repo";

export const organizationInvitationController = {
  // POST /organizations/:organizationId/invitations
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const data = request.body as OrganizationInvitationCreateInput;

    const createdBy = request.user.userId;

    const result = await organizationInvitationService.create(
      organizationId,
      createdBy,
      data,
    );

    return reply.code(201).send({
      success: true,
      message: "Invitation created successfully",
      data: result.invitation,
    });
  },

  // GET /organizations/:organizationId/invitations
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const invitations =
      await organizationInvitationService.getAllByOrganizationId(
        organizationId,
      );

    return reply.code(200).send({
      success: true,
      data: invitations,
    });
  },

  // DELETE /organizations/:organizationId/invitations/:invitationId
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { organizationId, invitationId } = request.params as {
      organizationId: string;
      invitationId: string;
    };

    await organizationInvitationService.delete(organizationId, invitationId);

    return reply.code(200).send({
      success: true,
      message: "Invitation cancelled successfully",
    });
  },

  // POST /invitations/accept
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.body as OrganizationInvitationAcceptInput;

    const userId = request.user.userId;

    const user = await UserRepo.findById(userId);
    const member = await organizationInvitationService.accept(
      token,
      userId,
      user?.email!,
    );
    return reply.code(200).send({
      success: true,
      message: "Invitation accepted successfully",
      data: member,
    });
  },
};
