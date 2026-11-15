import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "../Clients/Client.repo";
import DealRepo from "../Deal/Deal.repo";
import ActivityRepo from "./Activity.repo";
import { VActivity } from "./activity.validator";

export const activityService = {
  create: async (
    user: VAuth.userId,
    param: VActivity.organizationId,
    body: VActivity.create,
  ) => {
    if (body.clientId) {
      const client = await ClientRepo.getById({
        clientId: body.clientId,
        organizationId: param.organizationId,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (body.dealId) {
      const deal = await DealRepo.findById({
        dealId: body.dealId,
        organizationId: param.organizationId,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      if (body.clientId && deal.clientId !== body.clientId) {
        throw new CustomError(
          400,
          "Deal does not belong to the specified client",
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    const createdActivity = await db.transaction(async (tx) => {
      const created: NonNullable<any> = await ActivityRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
        userId: user.userId,
      })
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        userId: user.userId,
        action: "create",
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
  query: async (organization: VActivity.organizationId, query: VActivity.query) => {
    const activities = await ActivityRepo.query({
      ...organization,
      ...query
    })
    return activities
  },
  findById: async (param: VActivity.activityId) => {
    const foundActivity = await ActivityRepo.findById({ ...param });

    if (!foundActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    return foundActivity;
  },
  findByClient: async (param: { clientId: string, organizationId: string }) => {
    const client = await ClientRepo.getById(param);
    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }
    return await ActivityRepo.findByClient(param);
  },
  findByDeal: async (param: { dealId: string, organizationId: string }) => {
    const deal = await DealRepo.findById(param);
    if (!deal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }
    return await ActivityRepo.findByDeal(param);
  },
  update: async (
    user: VAuth.userId,
    param: VActivity.activityId,
    body: VActivity.update,
  ) => {
    const existingActivity = await ActivityRepo.findById({ ...param });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    if (body.clientId) {
      const client = await ClientRepo.getById({
        clientId: body.clientId,
        ...param,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (body.dealId) {
      const deal = await DealRepo.findById({
        dealId: body.dealId,
        ...param,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      const clientId =
        body.clientId !== undefined ? body.clientId : existingActivity.clientId;

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
        ...param,
        ...body,
      })
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        userId: user.userId,
        action: "update",
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
  delete: async (user: VAuth.userId, param: VActivity.activityId) => {
    const existingActivity = await ActivityRepo.findById({ ...param });

    if (!existingActivity) {
      throw new CustomError(404, "Activity not found", "ACTIVITY_NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      await ActivityRepo.delete(tx, { ...param });
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        userId: user.userId,
        action: "delete",
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
