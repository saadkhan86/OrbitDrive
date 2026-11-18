import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import { IReply } from "../../Interfaces/IReply";
import { generateSlug } from "../../Utils/slug.utils";
import { uploaderUtils } from "../../Utils/uploader.utils";
import { VAuth } from "../Auth/auth.validator";
import OrganizationMembersRepo from "../OrganizationMember/OrganizationMembers.repo";
import OrganizationRepo from "./Organization.repo";
import { VOrganization } from "./organization.validator";

export const organizationService = {
  create: async (user: VAuth.userId, body: VOrganization.create) => {
    const slug = generateSlug(body.name);
    const organization = await db.transaction(async (tx) => {
      const createdOrganization = await OrganizationRepo.create(tx, {
        ownerId: user.userId,
        name: body.name,
        slug,
      });
      if (!createdOrganization) throw new CustomError(500, "organization not created", "SERVER_ERROR")
      await OrganizationMembersRepo.create(tx, {
        organizationId: createdOrganization.id,
        userId: user.userId,
        role: "owner"
      });
      return createdOrganization;
    });
    return organization;
  },
  query: async (user: VAuth.userId, query: VOrganization.query): Promise<IReply.queryReturn> => {
    const { organizations, count } =
      await OrganizationRepo
        .query({ ...query, ...user });
    const hasNextPage = count > query.limit
    return { data: organizations, pagination: { limit: query.limit, hasNextPage, totalCount: count } };
  },
  getById: async (param: VOrganization.organizationId) => {
    const organization = await OrganizationRepo.getById({ organizationId: param.organizationId });
    if (!organization) {
      throw new CustomError(
        404,
        "organization not found",
        "NOT_FOUND",
      );
    }
    return organization;
  },
  update: async (
    user: VAuth.userId,
    param: VOrganization.organizationId,
    body: VOrganization.update,
  ) => {
    const slug = generateSlug(body.name!);
    const organization =
      await OrganizationRepo
        .update({
          ...param,
          name: body.name,
          slug: slug,
          userId: user.userId
        });
    return organization
  },
  delete: async (user: VAuth.userId, param: VOrganization.organizationId) => {
    return await OrganizationRepo.delete({ ...user, ...param });
  },
};
