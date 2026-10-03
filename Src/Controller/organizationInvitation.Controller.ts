import type { FastifyReply, FastifyRequest } from "fastify";

import { organizationInvitationService } from "../Services/organizationInvitation.Service";

import type {
  OrganizationInvitationCreateInput,
  OrganizationInvitationAcceptInput,
  OrganizationInvitationDeleteInput,
  OrganizationInvitationOrganizationIdInput,
} from "../Validators/organizationInvitation.Validator";
import UserRepo from "../Repositories/User.Repo";
import { UserIdInputValidator } from "../Validators/auth.Validator";

export const organizationInvitationController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const result = await organizationInvitationService.create(
      request.user as UserIdInputValidator,
      request.params as OrganizationInvitationOrganizationIdInput,
      request.body as OrganizationInvitationCreateInput,
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
        request.params as OrganizationInvitationOrganizationIdInput,
      );

    return reply.status(200).send({
      success: true,
      data: invitations,
    });
  },

  // DELETE /organizations/:organizationId/invitations/:invitationId
  async delete(request: FastifyRequest, reply: FastifyReply) {
    await organizationInvitationService.delete(
      request.params as OrganizationInvitationDeleteInput,
    );

    return reply.status(200).send({
      success: true,
      message: "Invitation cancelled successfully",
    });
  },

  // POST /invitations/accept
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as OrganizationInvitationAcceptInput;

    const userId = request.user.userId;

    const user = await UserRepo.findById(userId);
    const member = await organizationInvitationService.accept(
      token,
      userId,
      user?.email!,
    );
    return reply.status(200).send({
      success: true,
      message: "Invitation accepted successfully",
      data: member,
    });
  },
};
