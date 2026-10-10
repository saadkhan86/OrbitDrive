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

  public async findById(data: VDeal.dealId) {
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
    console.log(data);
    return await db
      .select()
      .from(deals)
      .where(eq(deals.organizationId, data.organizationId));
  }

  public async update(
    data: VDeal.update & VDeal.dealId & VDeal.organizationId,
  ) {
    let newData: Partial<typeof deals.$inferInsert> = {};
    if (data.currency) newData.currency = data.currency;
    if (data.description) newData.description = data.description;
    if (data.expectedCloseDate)
      newData.expectedCloseDate = data.expectedCloseDate;
    if (data.stage) newData.stage = data.stage;
    if (data.title) newData.title = data.title;
    if (data.value) newData.value = data.value.toString();
    return (
      await db
        .update(deals)
        .set(newData)
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
