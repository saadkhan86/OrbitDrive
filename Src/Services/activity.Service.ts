import { CustomError } from "../Errors/CustomError";
import ActivityRepo from "../Repositories/Activity.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";

import type { VActivity } from "../Validators/activity.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const activityService = {
  // Create activity
  create: async (
    organization: VActivity.organizationId,
    data: VActivity.create,
    user: VAuth.userId,
  ) => {
    if (data.clientId) {
      const client = await ClientRepo.getById({
        clientId: data.clientId,
        organizationId: organization.organizationId,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (data.dealId) {
      const deal = await dealRepo.findById({
        dealId: data.dealId,
        organizationId: organization.organizationId,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      if (data.clientId && deal.clientId !== data.clientId) {
        throw new CustomError(
          400,
          "Deal does not belong to the specified client",
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    return await ActivityRepo.create({
      ...data,
      organizationId: organization.organizationId,
      userId: user.userId,
    });
  },

  findById: async (activity: VActivity.activityId) => {
    const foundActivity = await ActivityRepo.findById({
      ...activity,
    });

    if (!foundActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    return foundActivity;
  },

  findAll: async (organization: VActivity.organizationId) => {
    return await ActivityRepo.findAll({
      organizationId: organization.organizationId,
    });
  },

  findByClient: async (clientId: string, organizationId: string) => {
    const client = await ClientRepo.getById({ clientId, organizationId });

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return await ActivityRepo.findByClient({ clientId, organizationId });
  },

  findByDeal: async (dealId: string, organizationId: string) => {
    const deal = await dealRepo.findById({ dealId, organizationId });

    if (!deal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return await ActivityRepo.findByDeal({ dealId, organizationId });
  },

  // Update activity
  update: async (activity: VActivity.activityId, data: VActivity.update) => {
    const existingActivity = await ActivityRepo.findById({
      ...activity,
    });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    // Validate updated client
    if (data.clientId) {
      const client = await ClientRepo.getById({
        clientId: data.clientId,
        ...activity,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (data.dealId) {
      const deal = await dealRepo.findById({
        dealId: data.dealId,
        ...activity,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      const clientId =
        data.clientId !== undefined ? data.clientId : existingActivity.clientId;

      if (clientId && deal.clientId !== clientId) {
        throw new CustomError(
          400,
          "Deal does not belong to the specified client",
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    return await ActivityRepo.update({ ...activity, ...data });
  },

  // Delete activity
  delete: async (activity: VActivity.activityId) => {
    const existingActivity = await ActivityRepo.findById({
      ...activity,
    });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    await ActivityRepo.delete({ ...activity });

    return {
      message: "Activity deleted successfully",
    };
  },
};
