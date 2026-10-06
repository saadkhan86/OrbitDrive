import { eq, and } from "drizzle-orm";

import type { VDeal } from "../Validators/deal.Validator";
import { db } from "../Database";
import { deals } from "../Database/Schemas/deals.Schema";

class DealRepo {
  public async create(data: VDeal.create & VDeal.organizationId) {
    return (
      await db
        .insert(deals)
        .values({
          organizationId: data.organizationId,
          clientId: data.clientId,
          title: data.title,
          value: data.value.toString(),
          currency: data.currency,
          stage: data.stage,
          expectedCloseDate: data.expectedCloseDate,
          description: data.description,
        })
        .returning()
    )[0];
  }

  public async findById(data: VDeal.organizationId & VDeal.dealId) {
    return (
      await db
        .select()
        .from(deals)
        .where(
          and(
            eq(deals.id, data.dealId),
            eq(deals.organizationId, data.organizationId),
          ),
        )
        .limit(1)
    )[0];
  }

  public async findAll(data: VDeal.organizationId) {
    return await db
      .select()
      .from(deals)
      .where(eq(deals.organizationId, data.organizationId));
  }

  public async update(
    data: VDeal.update & VDeal.dealId & VDeal.organizationId,
  ) {
    return (
      await db
        .update(deals)
        .set({
          ...data,
          value: data.value !== undefined ? data.value.toString() : undefined,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(deals.id, data.dealId),
            eq(deals.organizationId, data.organizationId),
          ),
        )
        .returning()
    )[0];
  }

  public async delete(data: VDeal.dealId & VDeal.organizationId) {
    return (
      await db
        .delete(deals)
        .where(
          and(
            eq(deals.id, data.dealId),
            eq(deals.organizationId, data.organizationId),
          ),
        )
        .returning()
    )[0];
  }
}

export default new DealRepo();
