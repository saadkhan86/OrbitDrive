import { CustomError } from "../Errors/CustomError";
import auditLogRepo from "../Repositories/auditLog.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";
import { VAuth } from "../Validators/auth.Validator";
import type { VDeal } from "../Validators/deal.Validator";

class DealService {
  public async create(
    user: VAuth.userId,
    deal: VDeal.organizationId,
    data: VDeal.create,
  ) {
    const client = await ClientRepo.getById({
      organizationId: deal.organizationId,
      clientId: data.clientId,
    });

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    const createdDeal = await dealRepo.create({
      ...data,
      organizationId: deal.organizationId,
    });

    if (!createdDeal) {
      throw new CustomError(
        500,
        "Something went wrong while creating deal",
        "SOMETHING_WENT_WRONG",
      );
    }

    await auditLogRepo.create({
      organizationId: createdDeal.organizationId,
      userId: user.userId,
      action: "DEAL_CREATED",
      entityType: "deal",
      entityId: createdDeal.id,
      metadata: {
        title: createdDeal.title,
        clientId: createdDeal.clientId,
        value: createdDeal.value,
      },
    });

    return createdDeal;
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

  public async findAll(deal: VDeal.organizationId) {
    return await dealRepo.findAll({
      organizationId: deal.organizationId,
    });
  }

  public async update(
    user: VAuth.userId,
    deal: VDeal.dealId & VDeal.organizationId,
    data: VDeal.update,
  ) {
    const foundDeal = await this.findById(deal);

    const updatedDeal = await dealRepo.update({
      dealId: deal.dealId,
      organizationId: deal.organizationId,
      ...(data as VDeal.update),
    });

    if (!updatedDeal) {
      throw new CustomError(
        500,
        "Something went wrong while updating deal",
        "SOMETHING_WENT_WRONG",
      );
    }

    await auditLogRepo.create({
      organizationId: updatedDeal.organizationId,
      userId: user.userId,
      action: "DEAL_UPDATED",
      entityType: "deal",
      entityId: updatedDeal.id,
      metadata: {
        previous: {
          title: foundDeal.title,
          clientId: foundDeal.clientId,
          value: foundDeal.value,
        },
        updated: {
          title: updatedDeal.title,
          clientId: updatedDeal.clientId,
          value: updatedDeal.value,
        },
      },
    });

    return updatedDeal;
  }

  public async delete(
    user: VAuth.userId,
    deal: VDeal.organizationId & VDeal.dealId,
  ) {
    const foundDeal = await this.findById(deal);

    const deletedDeal = await dealRepo.delete({
      dealId: deal.dealId,
      organizationId: deal.organizationId,
    });

    if (!deletedDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    await auditLogRepo.create({
      organizationId: deal.organizationId,
      userId: user.userId,
      action: "DEAL_DELETED",
      entityType: "deal",
      entityId: foundDeal.id,
      metadata: {
        title: foundDeal.title,
        clientId: foundDeal.clientId,
        value: foundDeal.value,
      },
    });

    return deletedDeal;
  }
}

export default new DealService();
