import { idValidator } from "../Validators/shared.Validator";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { organizationMemberRoleValidator } from "../Validators/organizationMember.Validator";

export const organizationMemberService = {
  getAllByOrganizationId: async (organizationId: idValidator) => {
    return await OrganizationMembersRepo.getAllByOrganizationId(organizationId);
  },
  getByUserId: async (userId: idValidator) => {
    return await OrganizationMembersRepo.getByUserId(userId);
  },
  updateOrganizationMember: async (
    organizationId: idValidator,
    organizationMemberId: idValidator,
    data: organizationMemberRoleValidator,
  ) => {
    return await OrganizationMembersRepo.updateOrganizationMember(
      organizationId,
      organizationMemberId,
      data.role,
    );
  },
  deleteOrganizationMember: async (
    organizationId: idValidator,
    organizationMemberId: idValidator,
  ) => {
    return await OrganizationMembersRepo.deleteOrganizationMember(
      organizationId,
      organizationMemberId,
    );
  },
};
