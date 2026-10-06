import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import OrganizationRepo from "../Repositories/Organization.Repo";
import OrganizationMembersRepo from "../Repositories/OrganizationMembers.Repo";
import { generateSlug } from "../Utils/slug.Utils";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganization } from "../Validators/organization.Validator";

export const organizationService = {
  create: async (user: VAuth.userId, data: VOrganization.create) => {
    const slug = generateSlug(data.name);
    const existingOrganization = await OrganizationRepo.findByOwnerAndSlug({
      userId: user.userId,
      slug,
    });
    if (existingOrganization) {
      throw new CustomError(
        409,
        "Organization with the given name already exists",
        "ORGANIZATION_ALREADY_EXISTS",
      );
    }
    const organization = await db.transaction(async (tx) => {
      const createdOrganization = await OrganizationRepo.create(tx, {
        ownerId: user.userId,
        name: data.name,
        slug,
      });
      await OrganizationMembersRepo.createOrganizationMember(tx, {
        organizationId: createdOrganization!.id,
        userId: user.userId,
        role: "OWNER",
      });
      return createdOrganization;
    });
    return organization;
  },
  getAllByOwnerId: async (user: VAuth.userId) => {
    return await OrganizationRepo.getAllByOwnerId(user);
  },
  getById: async (user: VAuth.userId, org: VOrganization.getById) => {
    const organization = await OrganizationRepo.getById({ ...user, ...org });
    if (!organization) {
      throw new CustomError(
        404,
        "You don't have permission to access this organization",
        "UNAUTHORIZED",
      );
    }
    return organization;
  },
  update: async (
    user: VAuth.userId,
    org: VOrganization.getById,
    data: VOrganization.update,
  ) => {
    let organization: any = await OrganizationRepo.getById({ ...user, ...org });
    if (!organization) {
      throw new CustomError(
        404,
        "You don't have permission to access this organization",
        "UNAUTHORIZED",
      );
    }
    if (!data.name)
      throw new CustomError(
        400,
        "Organization name is required",
        "ORGANIZATION_NAME_REQUIRED",
      );
    const slug = generateSlug(data.name);
    organization = await OrganizationRepo.findByOwnerAndSlug({ ...user, slug });
    if (organization) {
      throw new CustomError(
        409,
        "Organization with the given name already exists",
        "ORGANIZATION_ALREADY_EXISTS",
      );
    }
    return await OrganizationRepo.update({
      ...org,
      name: data.name,
      slug: slug,
    });
  },
  delete: async (user: VAuth.userId, org: VOrganization.getById) => {
    const organization = await OrganizationRepo.getById({ ...user, ...org });
    if (!organization) {
      throw new CustomError(
        404,
        "You don't have permission to access this organization",
        "UNAUTHORIZED",
      );
    }
    return await OrganizationRepo.delete(user, org);
  },
};
