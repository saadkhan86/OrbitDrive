import { CustomError } from "../Errors/CustomError";
import OrganizationRepo from "../Repositories/Organization.Repo";
import { createOrganizationValidator } from "../Validators/organization.Validator";
import { idValidator } from "../Validators/shared.Validator";

export const organizationService = {
  create: async (ownerId: idValidator, data: createOrganizationValidator) => {
    const organization = await OrganizationRepo.findByOwnerAndSlug(
      ownerId,
      data.slug,
    );
    if (organization) {
      throw new CustomError(
        409,
        "Organization already exists",
        "ORGANIZATION_ALREADY_EXISTS",
      );
    }
    return await OrganizationRepo.create(ownerId, data);
  },
  getAll: async (ownerId: idValidator) => {
    return await OrganizationRepo.getAll(ownerId);
  },
  getById: async (ownerId: idValidator, id: idValidator) => {
    const organization = await OrganizationRepo.getById(ownerId, id);
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
    ownerId: idValidator,
    id: idValidator,
    data: createOrganizationValidator,
  ) => {
    let organization: any = await OrganizationRepo.getById(ownerId, id);
    if (!organization) {
      throw new CustomError(
        404,
        "You don't have permission to access this organization",
        "UNAUTHORIZED",
      );
    }
    organization = await OrganizationRepo.findByOwnerAndSlug(
      ownerId,
      data.slug,
    );
    if (organization) {
      throw new CustomError(
        409,
        "Organization with the given slug already exists",
        "ORGANIZATION_ALREADY_EXISTS",
      );
    }
    return await OrganizationRepo.update(id, data);
  },
  delete: async (ownerId: idValidator, id: idValidator) => {
    const organization = await OrganizationRepo.getById(ownerId, id);
    if (!organization) {
      throw new CustomError(
        404,
        "You don't have permission to access this organization",
        "UNAUTHORIZED",
      );
    }
    return await OrganizationRepo.delete(ownerId, id);
  },
};
