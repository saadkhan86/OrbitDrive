import { idValidator } from "../Validators/shared.Validator";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { organizationMemberRoleValidator } from "../Validators/organizationMember.Validator";
import { CustomError } from "../Errors/CustomError";

export const organizationMemberService = {
  getAllByOrganizationId: async (organizationId: idValidator) => {
    return await OrganizationMembersRepo.getAllByOrganizationId(organizationId);
  },
  getByUserId: async (userId: idValidator) => {
    return await OrganizationMembersRepo.getByUserId(userId);
  },
  updateOrganizationMember: async (
    currentUserId: idValidator,
    organizationId: idValidator,
    organizationMemberId: idValidator,
    data: organizationMemberRoleValidator,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById(
      organizationId,
      organizationMemberId,
    );
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    if (targetOrganizationMember?.userId == currentUserId) {
      throw new CustomError(
        403,
        "You cannot update your own role",
        "CANNOT_UPDATE_SELF_ROLE",
      );
    }
    return await OrganizationMembersRepo.updateOrganizationMember(
      organizationId,
      organizationMemberId,
      data.role,
    );
  },
  deleteOrganizationMember: async (
    currentUserId: idValidator,
    organizationId: idValidator,
    organizationMemberId: idValidator,
  ) => {
    const targetOrganizationMember = await OrganizationMembersRepo.getById(
      organizationId,
      organizationMemberId,
    );
    if (!targetOrganizationMember) {
      throw new CustomError(404, "organization member not found", "NOT_FOUND");
    }
    if (targetOrganizationMember?.userId == currentUserId) {
      throw new CustomError(
        403,
        "You cannot delete your own organization member entry",
        "CANNOT_DELETE_SELF_ROLE",
      );
    }
    return await OrganizationMembersRepo.deleteOrganizationMember(
      organizationId,
      organizationMemberId,
    );
  },
};
