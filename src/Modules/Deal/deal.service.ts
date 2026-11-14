import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "../Clients/Client.repo";
import DealRepo from "./Deal.repo";
import { VDeal } from "./deal.validator";

class DealService {
  public async create(
    user: VAuth.userId,
    param: VDeal.organizationId,
    body: VDeal.create,
  ) {
    const client = await ClientRepo.getById({
      organizationId: param.organizationId,
      clientId: body.clientId,
    });

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }
    const deal = await db.transaction(async (tx) => {
      const createdDeal: NonNullable<any> = await DealRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
      });

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
  }

  public async findById(param: VDeal.dealId & VDeal.organizationId) {
    const foundDeal = await DealRepo.findById({
      dealId: param.dealId,
      organizationId: param.organizationId,
    });

    if (!foundDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return foundDeal;
  }

  public async query(param: VDeal.organizationId, query: VDeal.query) {
    const deals = await DealRepo.query({
      ...param,
      ...query
    });
    return deals
  }

  public async update(
    user: VAuth.userId,
    param: VDeal.dealId & VDeal.organizationId,
    body: VDeal.update,
  ) {
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
  }

  public async delete(
    user: VAuth.userId,
    param: VDeal.organizationId & VDeal.dealId,
  ) {
    const foundDeal = await DealRepo.findById(param);
    const deletedDeal = await db.transaction(async (tx) => {
      await DealRepo.delete(tx, {
        dealId: param.dealId,
        organizationId: param.organizationId,
      });
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
        userId: user.userId,
        action: "delete",
        entityType: "deal",
        entityId: foundDeal.id,
        metadata: {
          title: foundDeal.title,
          clientId: foundDeal.clientId,
          value: foundDeal.value,
        },
      });
    })
    return true;
  }
}

export default new DealService();
