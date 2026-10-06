import { CustomError } from "../Errors/CustomError";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";
import type { VDeal } from "../Validators/deal.Validator";

class DealService {
  public async create(deal: VDeal.organizationId, data: VDeal.create) {
    const client = await ClientRepo.getById({
      organizationId: deal.organizationId,
      clientId: data.clientId,
    });

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return await dealRepo.create({
      ...data,
      organizationId: deal.organizationId,
    });
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
    return await dealRepo.findAll({ organizationId: deal.organizationId });
  }

  public async update(
    deal: VDeal.dealId & VDeal.organizationId,
    data: VDeal.update,
  ) {
    const foundDeal = await this.findById(deal);
    if (!foundDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }
    return await dealRepo.update({
      dealId: deal.dealId,
      organizationId: deal.organizationId,
      ...(data as VDeal.update),
    });
  }

  public async delete(deal: VDeal.organizationId & VDeal.dealId) {
    return await dealRepo.delete({
      dealId: deal.dealId,
      organizationId: deal.organizationId,
    });
  }
}

export default new DealService();
