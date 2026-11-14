import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import { addEmailJob } from "../../Queues/email.queue";
import { tokenUtils } from "../../Utils/authToken.utils";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import NotificationRepo from "../Notification/Notification.repo";
import OrganizationRepo from "../Organization/Organization.repo";
import OrganizationMembersRepo from "../OrganizationMember/OrganizationMembers.repo";
import UserRepo from "../User/User.repo";
import OrganizationInvitationRepo from "./OrganizationInvitation.repo";
import { VOrganizationInvitation } from "./organizationInvitation.validator";

export const organizationInvitationService = {
  async create(
    user: VAuth.userId & VAuth.email,
    param: VOrganizationInvitation.organizationId,
    body: VOrganizationInvitation.create,
  ) {
    if (body.email.toLowerCase() == user.email.toLowerCase()) {
      throw new CustomError(
        409,
        "You can not create invitation to self",
        "CANNOT_CREATE_INVITATION_TO_SELF",
      );
    }
    const existingInvitation =
      await OrganizationInvitationRepo.getPendingByEmail({ organizationId: param.organizationId, email: body.email });

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
    const targetUser = await UserRepo.findByEmail({ email: body.email })
    const token = await tokenUtils.generateToken();
    const tokenHash = await tokenUtils.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const invitation = await db.transaction(async (tx) => {
      const createdInvitation: NonNullable<any> = await OrganizationInvitationRepo.create(tx, {
        organizationId: param.organizationId,
        email: body.email,
        role: body.role,
        tokenHash,
        expiresAt,
        createdBy: user.userId,
      });
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        action: "invite",
        entityType: "organization_invite",
        entityId: createdInvitation.id,
        userId: user.userId,
        metadata: {
          invitedEmail: createdInvitation.email,
          assignedRole: createdInvitation.role,
          expiresAt: createdInvitation.expiresAt,
        },
      });
      if (targetUser) {
        await NotificationRepo.create(tx, {
          organizationId: param.organizationId,
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

  async query(param: VOrganizationInvitation.organizationId, query: VOrganizationInvitation.query) {
    const invitations = await OrganizationInvitationRepo.query({ ...param, ...query });
    return invitations
  },

  async getById(param: VOrganizationInvitation.invitationId) {
    const foundInvitation = await OrganizationInvitationRepo.getById(param);
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
    param: VOrganizationInvitation.invitationId,
  ) {
    const foundInvitation = await OrganizationInvitationRepo.getById(param);

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

      await AuditLogRepo.create(tx, {
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
      OrganizationInvitationRepo.delete(tx, { invitationId: param.invitationId, organizationId: param.organizationId })
    })
    return true;
  },

  async accept(
    user: VAuth.userId & VAuth.email,
    param: VOrganizationInvitation.token,
  ) {
    const invitation = await OrganizationInvitationRepo.getByTokenHash({
      token: await tokenUtils.hashToken(param.token),
    });

    if (!invitation) {
      throw new CustomError(404, "Invalid invitation token", "INVALID_INVITATION_token");
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

      await AuditLogRepo.create(
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
