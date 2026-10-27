import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import auditLogRepo from "../Repositories/auditLog.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";
import { VAuth } from "../Validators/auth.Validator";
import type { VDeal } from "../Validators/deal.Validator";

class DealService {
  public async create(
    user: VAuth.userId,
    organization: VDeal.organizationId,
    data: VDeal.create,
  ) {
    const client = await ClientRepo.getById({
      organizationId: organization.organizationId,
      clientId: data.clientId,
    });

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }
    const deal = await db.transaction(async (tx) => {
      const createdDeal = await dealRepo.create(tx, {
        ...data,
        organizationId: organization.organizationId,
      });
      await auditLogRepo.create(tx, {
        organizationId: createdDeal!.organizationId,
        userId: user.userId,
        action: "create",
        entityType: "deal",
        entityId: createdDeal!.id,
        metadata: {
          title: createdDeal!.title,
          clientId: createdDeal!.clientId,
          value: createdDeal!.value,
        },
      });
      return createdDeal
    })
    return deal;
  }

  public async findById(deal: VDeal.dealId & VDeal.organizationId) {
    const foundDeal = await dealRepo.findById({
      dealId: deal.dealId,
      organizationId: deal.organizationId,
    });

    if (!foundDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return foundDeal;
  }

  public async query(organization: VDeal.organizationId, query: VDeal.query) {
    const deals = await dealRepo.query({
      ...organization,
      ...query
    });
    return deals
  }

  public async update(
    user: VAuth.userId,
    deal: VDeal.dealId & VDeal.organizationId,
    data: VDeal.update,
  ) {
    const found = await dealRepo.findById({ dealId: deal.dealId, organizationId: deal.organizationId })
    if (!found) throw new CustomError(404, "Deal not found", "NOT_FOUND");
    const updatedDeal = await db.transaction(async (tx) => {
      const updated = await dealRepo.update(tx, {
        dealId: deal.dealId,
        organizationId: deal.organizationId,
        ...(data as VDeal.update),
      });
      if (!updated) throw new CustomError(500, "deal not updated", "SOMETHING_WENT_WRONG")
      await auditLogRepo.create(tx, {
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
    deal: VDeal.organizationId & VDeal.dealId,
  ) {
    const foundDeal = await this.findById(deal);
    const deletedDeal = await db.transaction(async (tx) => {
      await dealRepo.delete(tx, {
        dealId: deal.dealId,
        organizationId: deal.organizationId,
      });
      await auditLogRepo.create(tx, {
        organizationId: deal.organizationId,
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
