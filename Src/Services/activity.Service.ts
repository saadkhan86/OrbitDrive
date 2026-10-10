import CustomError from "../Errors/CustomError";

import activityRepo from "../Repositories/activity.Repo";
import clientRepo from "../Repositories/client.Repo";
import dealRepo from "../Repositories/deal.Repo";

import type { VActivity } from "../Validators/activity.Validator";

export const activityService = {
  // Create activity
  create: async (
    organizationId: string,
    data: VActivity.create,
    userId: string,
  ) => {
    // Validate client belongs to organization
    if (data.clientId) {
      const client = await clientRepo.findById(
        data.clientId,
        organizationId,
      );

      if (!client) {
        throw new CustomError(
          "Client not found",
          404,
          "CLIENT_NOT_FOUND",
        );
      }
    }

    // Validate deal belongs to organization
    if (data.dealId) {
      const deal = await dealRepo.findById(
        data.dealId,
        organizationId,
      );

      if (!deal) {
        throw new CustomError(
          "Deal not found",
          404,
          "DEAL_NOT_FOUND",
        );
      }

      // If both client and deal are provided, ensure they match
      if (data.clientId && deal.clientId !== data.clientId) {
        throw new CustomError(
          "Deal does not belong to the specified client",
          400,
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    return await activityRepo.create({
      ...data,
      organizationId,
      userId,
    });
  },

  // Get activity by ID
  findById: async (
    activityId: string,
    organizationId: string,
  ) => {
    const activity = await activityRepo.findById(
      activityId,
      organizationId,
    );

    if (!activity) {
      throw new CustomError(
        "Activity not found",
        404,
        "ACTIVITY_NOT_FOUND",
      );
    }

    return activity;
  },

  // Get all organization activities
  findAll: async (organizationId: string) => {
    return await activityRepo.findAll(organizationId);
  },

  // Get activities by client
  findByClient: async (
    clientId: string,
    organizationId: string,
  ) => {
    const client = await clientRepo.findById(
      clientId,
      organizationId,
    );

    if (!client) {
      throw new CustomError(
        "Client not found",
        404,
        "CLIENT_NOT_FOUND",
      );
    }

    return await activityRepo.findByClient(
      clientId,
      organizationId,
    );
  },

  // Get activities by deal
  findByDeal: async (
    dealId: string,
    organizationId: string,
  ) => {
    const deal = await dealRepo.findById(
      dealId,
      organizationId,
    );

    if (!deal) {
      throw new CustomError(
        "Deal not found",
        404,
        "DEAL_NOT_FOUND",
      );
    }

    return await activityRepo.findByDeal(
      dealId,
      organizationId,
    );
  },

  // Update activity
  update: async (
    activityId: string,
    organizationId: string,
    data: VActivity.update,
  ) => {
    const existingActivity = await activityRepo.findById(
      activityId,
      organizationId,
    );

    if (!existingActivity) {
      throw new CustomError(
        "Activity not found",
        404,
        "ACTIVITY_NOT_FOUND",
      );
    }

    // Validate updated client
    if (data.clientId) {
      const client = await clientRepo.findById(
        data.clientId,
        organizationId,
      );

      if (!client) {
        throw new CustomError(
          "Client not found",
          404,
          "CLIENT_NOT_FOUND",
        );
      }
    }

    // Validate updated deal
    if (data.dealId) {
      const deal = await dealRepo.findById(
        data.dealId,
        organizationId,
      );

      if (!deal) {
        throw new CustomError(
          "Deal not found",
          404,
          "DEAL_NOT_FOUND",
        );
      }

      const clientId = data.clientId !== undefined
        ? data.clientId
        : existingActivity.clientId;

      if (clientId && deal.clientId !== clientId) {
        throw new CustomError(
          "Deal does not belong to the specified client",
          400,
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    return await activityRepo.update(
      activityId,
      organizationId,
      data,
    );
  },

  // Delete activity
  delete: async (
    activityId: string,
    organizationId: string,
  ) => {
    const existingActivity = await activityRepo.findById(
      activityId,
      organizationId,
    );

    if (!existingActivity) {
      throw new CustomError(
        "Activity not found",
        404,
        "ACTIVITY_NOT_FOUND",
      );
    }

    await activityRepo.delete(
      activityId,
      organizationId,
    );

    return {
      message: "Activity deleted successfully",
    };
  },
};

