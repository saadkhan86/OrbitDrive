import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { CustomError } from "../Errors/CustomError";
import { VAuth } from "../Validators/auth.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";
import notificationRepo from "../Repositories/notification.Repo";
import { db } from "../Database";

export const organizationMemberService = {
  query: async (organization: VOrganizationMember.organizationId, query: VOrganizationMember.query) => {
    const members = await OrganizationMembersRepo.query({ ...organization, ...query });
    return members
  },
  getById: async (organizationMember: VOrganizationMember.memberId) => {
    const member = await OrganizationMembersRepo.getById({ ...organizationMember });
    if (!member) throw new CustomError(404, "organization member not found", "NOT_FOUND");
    return member
  },
  update: async (
    currentUser: VAuth.userId,
    orgMember: VOrganizationMember.memberId,
    data: VOrganizationMember.role,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById({
      ...orgMember,
    });
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    const member = await db.transaction(async (tx) => {

      const updatedMember =
        await OrganizationMembersRepo.update({
          ...orgMember,
          ...data,
        });
      await auditLogRepo.create(tx, {
        organizationId: targetOrganizationMember.organizationId,
        action: "create",
        entityType: "organization_member",
        entityId: targetOrganizationMember.id,
        userId: currentUser.userId,
        metadata: {
          changedBy: currentUser.userId,
          newRole: data.role,
          previousRole: targetOrganizationMember.role,
          targetMember: targetOrganizationMember.userId,
        },
      });
      notificationRepo.create(tx, {
        type: "role",
        userId: targetOrganizationMember.userId!,
        organizationId: targetOrganizationMember.organizationId,
        title: "Your role has been updated",
      });
      return updatedMember;
    })

    return member;
  },
  delete: async (
    currentUser: VAuth.userId,
    orgMember: VOrganizationMember.memberId,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById({
      ...orgMember,
    });
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    if (targetOrganizationMember?.userId == currentUser.userId) {
      throw new CustomError(
        403,
        "You cannot delete yourself",
        "CANNOT_DELETE_SELF_ROLE",
      );
    }
    const member = await db.transaction(async (tx) => {
      await OrganizationMembersRepo.delete(tx, {
        ...orgMember,
      });
      await auditLogRepo.create(tx, {
        organizationId: targetOrganizationMember.organizationId,
        action: "delete",
        entityType: "organization_member",
        entityId: targetOrganizationMember.id,
        metadata: {
          deletedBy: currentUser.userId,
          roleOfDeletedMember: targetOrganizationMember.role,
          targetMember: targetOrganizationMember.userId,
        },
      });

      notificationRepo.create(tx, {
        type: "role",
        userId: targetOrganizationMember.userId!,
        organizationId: targetOrganizationMember.organizationId,
        title: "You role has been updated",
      })
    });
    return true
  },
};
