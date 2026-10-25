import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import OrganizationInvitationRepo from "../Repositories/OrganizationInvitation.Repo";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { addEmailJob } from "../Queues/Email.Queue";
import OrganizationRepo from "../Repositories/Organization.Repo";
import { tokenUtils } from "../Utils/authTokenUtils";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";
import UserRepo from "../Repositories/User.Repo";
import notificationRepo from "../Repositories/notification.Repo";


export const organizationInvitationService = {
  async create(
    currentUser: VAuth.userId & VAuth.email,
    org: VOrganizationInvitation.organizationId,
    data: VOrganizationInvitation.create,
  ) {
    if (data.email.toLowerCase() == currentUser.email.toLowerCase()) {
      throw new CustomError(
        409,
        "You can not create invitation to self",
        "CANNOT_CREATE_INVITATION_TO_SELF",
      );
    }
    const existingInvitation =
      await OrganizationInvitationRepo.getPendingByEmail({ organizationId: org.organizationId, email: data.email });

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
    const targetUser = await UserRepo.findByEmail({ email: data.email })
    const token = await tokenUtils.generateToken();
    const tokenHash = await tokenUtils.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await db.transaction(async (tx) => {
      const createdInvitation = await OrganizationInvitationRepo.create(tx, {
        organizationId: org.organizationId,
        email: data.email,
        role: data.role,
        tokenHash,
        expiresAt,
        createdBy: currentUser.userId,
      });
      if (!createdInvitation) throw new CustomError(500, "Internal server error", "INTERNAL_SERVER_ERROR")
      await auditLogRepo.create(tx, {
        organizationId: org.organizationId,
        action: "invite",
        entityType: "organization_invite",
        entityId: createdInvitation.id,
        userId: currentUser.userId,
        metadata: {
          invitedEmail: createdInvitation.email,
          assignedRole: createdInvitation.role,
          expiresAt: createdInvitation.expiresAt,
        },
      });
      if (targetUser) {
        await notificationRepo.create(tx, {
          organizationId: org.organizationId,
          userId: targetUser.id,
          title: "Invitation From Organization",
          description: "New Invitation found.Check your email for further information",
          type: "invitation",
          isRead: false,
          readAt: null
        });
      }
      return createdInvitation;
    })

    const organization = await OrganizationRepo.getByOrganizationId({ organizationId: invitation?.organizationId! });
    if (!organization) {
      throw new CustomError(
        404,
        "Organization Not Found",
        "ORGANIZATION_NOT_FOUND",
      );
    }

    await addEmailJob("organization-invitation", {
      email: invitation!.email,
      verificationToken: token,
      expiresIn: 24,
      organizationName: organization?.name,
      role: invitation!.role,
    });

    return {
      invitation,
    };
  },

  async query(organization: VOrganizationInvitation.organizationId, query: VOrganizationInvitation.query) {
    const invitations = await OrganizationInvitationRepo.query({ ...organization, ...query });
    return invitations
  },

  async getById(invitation: VOrganizationInvitation.invitationId) {
    const foundInvitation = await OrganizationInvitationRepo.getById(invitation);
    if (!foundInvitation) {
      throw new CustomError(
        404,
        "Invitation not found",
        "INVITATION_NOT_FOUND",
      );
    }
    return foundInvitation;
  },

  async delete(
    user: VAuth.userId,
    invitation: VOrganizationInvitation.invitationId,
  ) {
    const foundInvitation = await OrganizationInvitationRepo.getById(invitation);

    if (!foundInvitation) {
      throw new CustomError(
        404,
        "Invitation not found",
        "INVITATION_NOT_FOUND",
      );
    }

    if (foundInvitation.acceptedAt) {
      throw new CustomError(
        409,
        "Accepted invitation cannot be cancelled",

        "INVITATION_ALREADY_ACCEPTED",
      );
    }
    await db.transaction(async (tx) => {

      await auditLogRepo.create(tx, {
        organizationId: foundInvitation.organizationId,
        action: "delete",
        entityType: "organization_invite",
        entityId: foundInvitation.id,
        userId: user.userId,
        metadata: {
          invitedEmail: foundInvitation.email,
          assignedRole: foundInvitation.role,
        },
      });
      OrganizationInvitationRepo.delete(tx, { invitationId: invitation.invitationId, organizationId: invitation.organizationId })
    })
    return true;
  },

  async accept(
    user: VAuth.userId & VAuth.email,
    orgInvitation: VOrganizationInvitation.token,
  ) {
    const invitation = await OrganizationInvitationRepo.getByTokenHash({
      token: await tokenUtils.hashToken(orgInvitation.token),
    });

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
    if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new CustomError(
        403,
        "This invitation belongs to a different email",
        "INVITATION_EMAIL_MISMATCH",
      );
    }

    const existingMember =
      await OrganizationMembersRepo.getByUserId({
        organizationId: invitation.organizationId,
        userId: user.userId,
      });

    if (existingMember) {
      throw new CustomError(
        409,
        "You are already a member of this organization",
        "ALREADY_ORGANIZATION_MEMBER",
      );
    }
    const member = await db.transaction(async (tx) => {
      const createdMember =
        await OrganizationMembersRepo.create(tx, {
          organizationId: invitation.organizationId,
          userId: user.userId,
          role: invitation.role,
        });

      await OrganizationInvitationRepo.accept(tx, {
        invitationId: invitation.id,
        organizationId: invitation.organizationId,
      });

      await auditLogRepo.create(
        tx,
        {
          organizationId: invitation.organizationId,
          action: "join",
          entityType: "organization_invite",
          entityId: invitation!.id,
          userId: user.userId,
          metadata: {
            invitedEmail: invitation!.email,
            assignedRole: invitation!.role,
          },
        },
      );
      return createdMember;
    });
    return true;
  },
};
