import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import NotificationRepo from "../Notification/Notification.repo";
import { VOrganizationMember } from "./organizationMember.validator";
import OrganizationMembersRepo from "./OrganizationMembers.repo";

export const organizationMemberService = {
  getForCurrentUser: async (user: VAuth.userId) => {
    const organizations = await OrganizationMembersRepo.getForCurrentUser({ userId: user.userId })
    return organizations
  },
  query: async (param: VOrganizationMember.organizationId, query: VOrganizationMember.query) => {
    const members = await OrganizationMembersRepo.query({ ...param, ...query });
    return members
  },
  getById: async (param: VOrganizationMember.memberId) => {
    const member = await OrganizationMembersRepo.getById({ ...param });
    if (!member) throw new CustomError(404, "organization member not found", "NOT_FOUND");
    return member
  },
  update: async (
    user: VAuth.userId,
    param: VOrganizationMember.memberId,
    body: VOrganizationMember.role,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById({
      ...param,
    });
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    const member = await db.transaction(async (tx) => {

      const updatedMember =
        await OrganizationMembersRepo.update({
          ...param,
          ...body,
        });
      await AuditLogRepo.create(tx, {
        organizationId: targetOrganizationMember.organizationId,
        action: "create",
        entityType: "organization_member",
        entityId: targetOrganizationMember.id,
        userId: user.userId,
        metadata: {
          changedBy: user.userId,
          newRole: body.role,
          previousRole: targetOrganizationMember.role,
          targetMember: targetOrganizationMember.userId,
        },
      });
      NotificationRepo.create(tx, {
        type: "role",
        userId: targetOrganizationMember.userId!,
        organizationId: targetOrganizationMember.organizationId,
        title: `You role has been updated from ${targetOrganizationMember.role} to ${body.role}`,
      });
      return updatedMember;
    })

    return member;
  },
  delete: async (
    user: VAuth.userId,
    param: VOrganizationMember.memberId,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById({
      ...param,
    });
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    if (targetOrganizationMember?.userId == user.userId) {
      throw new CustomError(
        403,
        "You cannot delete yourself",
        "CANNOT_DELETE_SELF_ROLE",
      );
    }
    const member = await db.transaction(async (tx) => {
      await OrganizationMembersRepo.delete(tx, {
        ...param,
      });
      await AuditLogRepo.create(tx, {
        organizationId: targetOrganizationMember.organizationId,
        action: "delete",
        entityType: "organization_member",
        entityId: targetOrganizationMember.id,
        metadata: {
          deletedBy: user.userId,
          roleOfDeletedMember: targetOrganizationMember.role,
          targetMember: targetOrganizationMember.userId,
        },
      });

      NotificationRepo.create(tx, {
        type: "role",
        userId: targetOrganizationMember.userId!,
        organizationId: targetOrganizationMember.organizationId,
        title: "You are removed from organization",
      })
    });
    return true
  },
};
