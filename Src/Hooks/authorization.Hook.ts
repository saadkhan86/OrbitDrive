import { FastifyRequest } from "fastify";
import { OrganizationRole } from "../Types/organization";
import { CustomError } from "../Errors/CustomError";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";
import OrganizationInvitationRepo from "../Repositories/OrganizationInvitation.Repo";
import OrganizationRepo from "../Repositories/Organization.Repo";

export const authorize = {
  role: (allowedRoles: OrganizationRole[] = ["admin", "member", "owner", "viewer"]) => {
    return async (request: FastifyRequest) => {
      const params = request.params as VOrganizationMember.organizationId;
      const member = await OrganizationMembersRepo.getByUserId({ organizationId: params.organizationId, userId: request.user.userId });
      if (!member)
        throw new CustomError(
          403,
          "you are not a member of this organization",
          "NOT_A_MEMBER",
        );
      if (!allowedRoles.includes(member.role))
        throw new CustomError(
          403,
          "you are not authorized to perform this action",
          "NOT_AUTHORIZED",
        );
    };
  }, manageMember: () => {
    return async (request: FastifyRequest) => {
      const action = request.method === "PATCH" ? "update" : "delete"
      if (action == "update" && (request.body as VOrganizationMember.role).role == "owner") {
        throw new CustomError(400, "organization can have only single owner", "INVALID_INPUT")
      }
      const params = request.params as VOrganizationMember.memberId;
      const targetMember = await OrganizationMembersRepo.getById({ ...params })
      if (!targetMember) throw new CustomError(404, "member not found", "NOT_FOUND")
      if (targetMember.userId === request.user.userId) throw new CustomError(400, `you can not ${action} yourself`, `YOU_CANNOT_${action.toUpperCase()}_YOURSELF`)
      const requestingMember = await OrganizationMembersRepo.getByUserId({ organizationId: params.organizationId, userId: request.user.userId })
      if (!requestingMember) throw new CustomError(403, "you are not authorized to perform this action", "NOT_AUTHORIZED")
      if (targetMember.role === "owner") throw new CustomError(403, `you can not ${action} owner`, `YOU_CANNOT_${action.toUpperCase()}_OWNER`)
      if (requestingMember.role === "admin" && targetMember.role === "admin") throw new CustomError(403, `only owner of this organization can ${action} ${targetMember.role}`, "NOT_AUTHORIZED")

    }
  }, manageInvitation: () => {
    return async (request: FastifyRequest) => {
      const params = request.params as VOrganizationInvitation.invitationId
      const invitation = await OrganizationInvitationRepo.getById({ ...params })
      if (!invitation) throw new CustomError(404, "Invitation not found", "NOT_FOUND")
      const organization = await OrganizationRepo.getById({ organizationId: params.organizationId })
      if (!organization) throw new CustomError(404, "Organization not found", "NOT_FOUND")
      if (request.user.userId != organization.ownerId) {
        throw new CustomError(400, "Only owner can modify this invitation", "ACCESS_DENIED")
      }
    }
  }
}
