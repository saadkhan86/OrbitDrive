import OrganizationRepo from "../Repositories/Organization.Repo";
import { createOrganizationValidator } from "../Validators/organization.Validator";
import { idValidator } from "../Validators/shared.Validator";

export const organizationService = {
  create: async (userId: idValidator, body: createOrganizationValidator) => {
    return await OrganizationRepo.create(userId, body);
  },
  getAll: async (userId: idValidator) => {
    return await OrganizationRepo.getAll(userId);
  },
  getById: async (ownerId: idValidator, id: idValidator) => {
    return await OrganizationRepo.getById(id, ownerId);
  },
  update: async (id: idValidator, body: createOrganizationValidator) => {
    return await OrganizationRepo.update(id, body);
  },
  delete: async (id: idValidator) => {
    return await OrganizationRepo.delete(id);
  },
};
