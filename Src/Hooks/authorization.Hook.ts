import { FastifyRequest } from "fastify";
import { OrganizationRole } from "../Types/organization";
import { CustomError } from "../Errors/CustomError";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";

export const authorize = {
  role: (allowedRoles: OrganizationRole[]) => {
    return async (request: FastifyRequest) => {
      const { organizationId } = request.params as { organizationId: string };
      const userId = request.user.userId;
      if (!organizationId)
        throw new CustomError(
          404,
          "Organization id is required",
          "ORGANIZATION_ID_REQUIRED",
        );
      const member = await OrganizationMembersRepo.getByUserId(
        userId,
        organizationId,
      );
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
  },
};
