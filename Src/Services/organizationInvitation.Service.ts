import * as crypto from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import UserRepo from "../Repositories/User.Repo";
import { CustomError } from "../Errors/CustomError";
import { OrganizationInvitationCreateInput } from "../Validators/organizationInvitation.Validator";
import OrganizationInvitationRepo from "../Repositories/OrganizationInvitation.Repo";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { organization_members } from "../Database/Schemas/organization_members.Schema";

function generateInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashInvitationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const organizationInvitationService = {
  async create(
    organizationId: string,
    createdBy: string,
    data: OrganizationInvitationCreateInput,
  ) {
    const email = data.email.toLowerCase();

    // Find user by email
    const user = await UserRepo.findByEmail(email);

    if (!user) {
      throw new CustomError(
        404,
        "User with this email does not exist",

        "USER_NOT_FOUND",
      );
    }

    // Check existing membership
    const existingMember = await OrganizationMembersRepo.getByUserId(
      organizationId,
      user.id,
    );

    if (existingMember) {
      throw new CustomError(
        409,
        "User is already a member of this organization",

        "ALREADY_ORGANIZATION_MEMBER",
      );
    }

    // Check pending invitation
    const existingInvitation =
      await OrganizationInvitationRepo.getPendingByEmail(organizationId, email);

    if (
      existingInvitation &&
      !existingInvitation.acceptedAt &&
      existingInvitation.expiresAt != null &&
      existingInvitation.expiresAt > new Date()
    ) {
      throw new CustomError(
        409,

        "A pending invitation already exists for this email",
        "INVITATION_ALREADY_EXISTS",
      );
    }

    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invitation = await OrganizationInvitationRepo.create({
      organizationId,
      email,
      role: data.role,
      tokenHash,
      expiresAt,
      createdBy,
    });

    return {
      invitation,
      token,
    };
  },

  async getAllByOrganizationId(organizationId: string) {
    return OrganizationInvitationRepo.getAllByOrganizationId(organizationId);
  },

  async delete(organizationId: string, invitationId: string) {
    const invitation = await OrganizationInvitationRepo.getById(
      organizationId,
      invitationId,
    );

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

    return OrganizationInvitationRepo.delete(organizationId, invitationId);
  },

  async accept(token: string, userId: string, userEmail: string) {
    const tokenHash = hashInvitationToken(token);

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

    const existingMember = await OrganizationMembersRepo.getByUserId(
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
      const [createdMember] = await tx
        .insert(organization_members)
        .values({
          organizationId: invitation.organizationId,
          userId,
          role: invitation.role,
        })
        .returning();

      await tx
        .update(organization_invitations)
        .set({
          acceptedAt: new Date(),
        })
        .where(eq(organization_invitations.id, invitation.id));

      return createdMember;
    });

    return member;
  },
};
