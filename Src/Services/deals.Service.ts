import { CustomError } from "../Errors/CustomError";
import ClientRepo from "../Repositories/Client.Repo";
import dealRepo from "../Repositories/deal.Repo";
import type { VDeal } from "../Validators/deal.Validator";

class DealService {
  public async create(organizationId: string, data: VDeal.create) {
    // Check client exists in same organization
    const client = await ClientRepo.getById(data.clientId, organizationId);

    if (!client) {
      throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
    }

    return await dealRepo.create({
      ...data,
      organizationId,
    });
  }

  public async findById(dealId: string, organizationId: string) {
    const deal = await dealRepo.findById(dealId, organizationId);

    if (!deal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return deal;
  }

  public async findAll(organizationId: string) {
    return await dealRepo.findAll(organizationId);
  }

  public async update(
    dealId: string,
    organizationId: string,
    data: VDeal.update,
  ) {
    const existingDeal = await dealRepo.findById(dealId, organizationId);

    if (!existingDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    return await dealRepo.update(dealId, organizationId, data);
  }

  public async delete(dealId: string, organizationId: string) {
    const existingDeal = await dealRepo.findById(dealId, organizationId);

    if (!existingDeal) {
      throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
    }

    await dealRepo.delete(dealId, organizationId);

    return {
      message: "Deal deleted successfully",
    };
  }
}

export default new DealService();
