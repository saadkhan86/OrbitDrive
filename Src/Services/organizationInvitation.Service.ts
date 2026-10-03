import * as crypto from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import UserRepo from "../Repositories/User.Repo";
import { CustomError } from "../Errors/CustomError";
import {
  OrganizationInvitationCreateInput,
  OrganizationInvitationDeleteInput,
  OrganizationInvitationOrganizationIdInput,
} from "../Validators/organizationInvitation.Validator";
import OrganizationInvitationRepo from "../Repositories/OrganizationInvitation.Repo";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { organization_members } from "../Database/Schemas/organization_members.Schema";
import { addEmailJob, EmailQueue } from "../Queues/Email.Queue";
import OrganizationRepo from "../Repositories/Organization.Repo";
import { tokenUtils } from "../Utils/authTokenUtils";
import { UserIdInputValidator } from "../Validators/auth.Validator";

export const organizationInvitationService = {
  async create(
    user: UserIdInputValidator,
    org: OrganizationInvitationOrganizationIdInput,
    data: OrganizationInvitationCreateInput,
  ) {
    const targetUser = await UserRepo.findByEmail(data.email);
    if (targetUser && targetUser.email == data.email) {
      throw new CustomError(
        409,
        "You can not create invitation to self",
        "INVALID_EMAIL",
      );
    }
    const existingInvitation =
      await OrganizationInvitationRepo.getPendingByEmail(
        org.organizationId,
        data.email,
      );

    if (
      existingInvitation &&
      existingInvitation.expiresAt &&
      existingInvitation.expiresAt > new Date()
    ) {
      throw new CustomError(
        409,
        "Invitation already sent",
        "INVITATION_ALREADY_EXISTS",
      );
    }

    const token = await tokenUtils.generateToken();

    const tokenHash = await tokenUtils.hashToken(token);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await OrganizationInvitationRepo.create({
      organizationId: org.organizationId,
      email: data.email,
      role: data.role,
      tokenHash,
      expiresAt,
      createdBy: user.userId,
    });
    const organization = await OrganizationRepo.getByOrganizationId(
      org.organizationId,
    );
    if (!organization) {
      throw new CustomError(
        404,
        "Organization Not Found",
        "ORGANIZATION_NOT_FOUND",
      );
    }
    await addEmailJob("organization-invitation", {
      email: data.email,
      verificationToken: token,
      expiresIn: 24,
      organizationName: organization?.name,
      role: data.role,
    });

    return {
      invitation,
    };
  },

  async getAllByOrganizationId(org: OrganizationInvitationOrganizationIdInput) {
    return OrganizationInvitationRepo.getAllByOrganizationId(org);
  },

  async delete(org: OrganizationInvitationDeleteInput) {
    const invitation = await OrganizationInvitationRepo.getById(org);

    if (!invitation) {
      throw new CustomError(
        404,
        "Invitation not found",
        "INVITATION_NOT_FOUND",
      );
    }

    if (invitation.acceptedAt) {
      throw new CustomError(
        409,
        "Accepted invitation cannot be cancelled",

        "INVITATION_ALREADY_ACCEPTED",
      );
    }

    return OrganizationInvitationRepo.delete(org);
  },

  async accept(token: string, userId: string, userEmail: string) {
    const tokenHash = await tokenUtils.hashToken(token);

    const invitation =
      await OrganizationInvitationRepo.getByTokenHash(tokenHash);

    if (!invitation) {
      throw new CustomError(404, "Invalid invitation", "INVALID_INVITATION");
    }

    if (invitation.acceptedAt) {
      throw new CustomError(
        409,
        "Invitation has already been accepted",

        "INVITATION_ALREADY_ACCEPTED",
      );
    }

    if (invitation.expiresAt !== null && invitation.expiresAt <= new Date()) {
      throw new CustomError(
        410,
        "Invitation has expired",

        "INVITATION_EXPIRED",
      );
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new CustomError(
        403,
        "This invitation belongs to a different email",

        "INVITATION_EMAIL_MISMATCH",
      );
    }

    const existingMember =
      await OrganizationMembersRepo.getByOrganizationAndUserId(
        invitation.organizationId,
        userId,
      );

    if (existingMember) {
      throw new CustomError(
        409,
        "You are already a member of this organization",
        "ALREADY_ORGANIZATION_MEMBER",
      );
    }

    // Membership + invitation update must happen together
    const member = await db.transaction(async (tx) => {
      const createdMember =
        await OrganizationMembersRepo.createOrganizationMember(tx, {
          organizationId: invitation.organizationId,
          userId,
          role: invitation.role,
        });

      await OrganizationInvitationRepo.accept(tx, invitation.id);

      return createdMember;
    });

    return member;
  },
};
