import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { CustomError } from "../Errors/CustomError";
import { VAuth } from "../Validators/auth.Validator";

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
    return await OrganizationMembersRepo.deleteOrganizationMember({
      ...orgMember,
    });
  },
};
