import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { CustomError } from "../Errors/CustomError";
import { VAuth } from "../Validators/auth.Validator";
import auditLogRepo from "../Repositories/auditLog.Repo";

export const organizationMemberService = {
  getAllByOrganizationId: async (org: VOrganizationMember.organizationId) => {
    return await OrganizationMembersRepo.getAllByOrganizationId(org);
  },
  getByUserId: async (user: VAuth.userId) => {
    return await OrganizationMembersRepo.getByUserId({ ...user });
  },
  updateOrganizationMember: async (
    currentUser: VAuth.userId,
    orgMember: VOrganizationMember.organizationMemberId,
    data: VOrganizationMember.role,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById({
      ...currentUser,
      ...orgMember,
    });
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    if (targetOrganizationMember?.userId == currentUser.userId) {
      throw new CustomError(
        403,
        "You cannot update your own role",
        "CANNOT_UPDATE_SELF_ROLE",
      );
    }
    await auditLogRepo.create({
      organizationId: targetOrganizationMember.organizationId,
      action: "ORGANIZATION MEMBER ROLE UPDATE",
      entityType: "organizationMember",
      entityId: targetOrganizationMember.id,
      userId: currentUser.userId,
      metadata: {
        changedBy: currentUser.userId,
        newRole: data.role,
        previousRole: targetOrganizationMember.role,
        targetMember: targetOrganizationMember.userId,
      },
    });
    return await OrganizationMembersRepo.updateOrganizationMember({
      ...orgMember,
      ...data,
    });
  },
  deleteOrganizationMember: async (
    currentUser: VAuth.userId,
    orgMember: VOrganizationMember.organizationMemberId,
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
    await auditLogRepo.create({
      organizationId: targetOrganizationMember.organizationId,
      action: "ORGANIZATION MEMBER DELETED",
      entityType: "Organization Member",
      entityId: targetOrganizationMember.id,
      metadata: {
        deletedBy: currentUser.userId,
        roleOfDeletedMember: targetOrganizationMember.role,
        targetMember: targetOrganizationMember.userId,
      },
    });
    return await OrganizationMembersRepo.deleteOrganizationMember({
      ...orgMember,
    });
  },
};
