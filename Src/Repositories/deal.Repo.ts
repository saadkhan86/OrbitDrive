import { eq, and } from "drizzle-orm";

import type { VDeal } from "../Validators/deal.Validator";
import { db } from "../Database";
import { deals } from "../Database/Schemas/deals.Schema";

class DealRepo {
  public async create(data: VDeal.create & { organizationId: string }) {
    const [deal] = await db
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
      .returning();

    return deal;
  }

  public async findById(dealId: string, organizationId: string) {
    const [deal] = await db
      .select()
      .from(deals)
      .where(
        and(eq(deals.id, dealId), eq(deals.organizationId, organizationId)),
      )
      .limit(1);

    return deal ?? null;
  }

  public async findAll(organizationId: string) {
    return await db
      .select()
      .from(deals)
      .where(eq(deals.organizationId, organizationId));
  }

  public async update(
    dealId: string,
    organizationId: string,
    data: VDeal.update,
  ) {
    const [deal] = await db
      .update(deals)
      .set({
        ...data,
        value: data.value !== undefined ? data.value.toString() : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(eq(deals.id, dealId), eq(deals.organizationId, organizationId)),
      )
      .returning();

    return deal ?? null;
  }

  public async delete(dealId: string, organizationId: string) {
    const [deal] = await db
      .delete(deals)
      .where(
        and(eq(deals.id, dealId), eq(deals.organizationId, organizationId)),
      )
      .returning();

    return deal ?? null;
  }
}

export default new DealRepo();
