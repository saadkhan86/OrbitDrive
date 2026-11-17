import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "../Clients/Client.repo";
import DealRepo from "./Deal.repo";
import { VDeal } from "./deal.validator";

export const dealService = {
  create: async (
    user: VAuth.userId,
    param: VDeal.organizationId,
    body: VDeal.create,
  ) => {
    const deal = await db.transaction(async (tx) => {
      const createdDeal = await DealRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
      });
      if (!createdDeal) {
        throw new CustomError(500, "deal not created", "SERVER_ERROR")
      }
      await AuditLogRepo.create(tx, {
        organizationId: createdDeal.organizationId,
        userId: user.userId,
        action: "create",
        entityType: "deal",
        entityId: createdDeal.id,
        metadata: {
          title: createdDeal.title,
          clientId: createdDeal.clientId,
          value: createdDeal.value,
        },
      });
      return createdDeal
    })
    return deal;
  },
  findById: async (param: VDeal.dealId & VDeal.organizationId) => {
    const foundDeal = await DealRepo.findById({
      dealId: param.dealId,
      organizationId: param.organizationId,
    });
    if (!foundDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return foundDeal;
  },
  query: async (param: VDeal.organizationId, query: VDeal.query) => {
    const { deals, count } = await DealRepo.query({
      ...param,
      ...query
    });
    const hasNextPage = query.limit > count
    return { deals, pagination: { limit: query.limit, hasNextPage, totalCount: count } }
  },
  update: async (
    user: VAuth.userId,
    param: VDeal.dealId & VDeal.organizationId,
    body: VDeal.update,
  ) => {
    const found = await DealRepo.findById({ dealId: param.dealId, organizationId: param.organizationId })
    if (!found) throw new CustomError(404, "Deal not found", "NOT_FOUND");
    const updatedDeal = await db.transaction(async (tx) => {
      const updated = await DealRepo.update(tx, {
        dealId: param.dealId,
        organizationId: param.organizationId,
        ...body,
      });
      if (!updated) throw new CustomError(500, "deal not updated", "SOMETHING_WENT_WRONG")
      await AuditLogRepo.create(tx, {
        organizationId: updated.organizationId,
        userId: user.userId,
        action: "update",
        entityType: "deal",
        entityId: updated.id,
        metadata: {
          previous: {
            title: found.title,
            clientId: found.clientId,
            value: found.value,
          },
          updated: {
            title: updated.title,
            clientId: updated.clientId,
            value: updated.value,
          },
        },
      });
      return updated;
    })

    return updatedDeal;
  },

  delete: async (
    user: VAuth.userId,
    param: VDeal.organizationId & VDeal.dealId,
  ) => {
    const deletedDeal = await db.transaction(async (tx) => {
      const deleted = await DealRepo.delete(tx, {
        dealId: param.dealId,
        organizationId: param.organizationId,
      });
      if (!deleted) throw new CustomError(404, "deal not found", "NOT_FOUND")
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        userId: user.userId,
        action: "delete",
        entityType: "deal",
        entityId: deleted.id,
        metadata: {
          title: deleted.title,
          clientId: deleted.clientId,
          value: deleted.value,
        },
      });
    })
    return true;
  }
}
