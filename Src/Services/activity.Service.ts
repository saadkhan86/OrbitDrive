import { CustomError } from "../Errors/CustomError";
import ActivityRepo from "../Repositories/Activity.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";
import auditLogRepo from "../Repositories/auditLog.Repo";

import type { VActivity } from "../Validators/activity.Validator";
import type { VAuth } from "../Validators/auth.Validator";
import { db } from "../Database";

export const activityService = {
  create: async (
    user: VAuth.userId,
    organization: VActivity.organizationId,
    data: VActivity.create,
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

    const createdActivity = await db.transaction(async (tx) => {
      const created: NonNullable<any> = await ActivityRepo.create(tx, {
        ...data,
        organizationId: organization.organizationId,
        userId: user.userId,
      })
      await auditLogRepo.create(tx, {
        organizationId: organization.organizationId,
        userId: user.userId,
        action: "ACTIVITY_CREATED",
        entityType: "activity",
        entityId: created.id,
        metadata: {
          title: created.title,
          type: created.type,
          clientId: created.clientId,
          dealId: created.dealId,
        },
      })
    })

    return createdActivity;
  },

  findById: async (activity: VActivity.activityId) => {
    const foundActivity = await ActivityRepo.findById({ ...activity });

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

  update: async (
    user: VAuth.userId,
    activity: VActivity.activityId,
    data: VActivity.update,
  ) => {
    const existingActivity = await ActivityRepo.findById({ ...activity });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

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

    const updatedActivity = await db.transaction(async (tx) => {
      const updated: NonNullable<any> = await ActivityRepo.update(tx, {
        ...activity,
        ...data,
      })
      await auditLogRepo.create(tx, {
        organizationId: activity.organizationId,
        userId: user.userId,
        action: "ACTIVITY_UPDATED",
        entityType: "activity",
        entityId: updated.id,
        metadata: {
          previous: {
            title: existingActivity.title,
            type: existingActivity.type,
            clientId: existingActivity.clientId,
            dealId: existingActivity.dealId,
          },
          updated: {
            title: updated.title,
            type: updated.type,
            clientId: updated.clientId,
            dealId: updated.dealId,
          },
        },
      })
    })

    return updatedActivity;
  },

  delete: async (user: VAuth.userId, activity: VActivity.activityId) => {
    const existingActivity = await ActivityRepo.findById({ ...activity });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      await ActivityRepo.delete(tx,{ ...activity });
      await auditLogRepo.create(tx,{
        organizationId: activity.organizationId,
        userId: user.userId,
        action: "ACTIVITY_DELETED",
        entityType: "activity",
        entityId: existingActivity.id,
        metadata: {
          title: existingActivity.title,
          type: existingActivity.type,
          clientId: existingActivity.clientId,
          dealId: existingActivity.dealId,
        },
      });
    })

    return true
  },
};
