import { eq, and, ilike, or, count, desc } from "drizzle-orm";

import type { VDeal } from "../Validators/deal.Validator";
import { db } from "../Database";
import { deals } from "../Database/Schemas/deals.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class DealRepo {
  public async create(tx: NodePgDatabase, data: VDeal.create & VDeal.organizationId) {
    return (
      await tx
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

  public async query(data: VDeal.organizationId & VDeal.query) {
    const { page, limit } = data
    const _query: any[] = [eq(deals.organizationId, data.organizationId)]
    if (data.stage) _query.push(eq(deals.stage, data.stage));
    if (data.search) _query.push(or(ilike(deals.title, `%${data.search}%`), ilike(deals.value, `%${data.search}%`), ilike(deals.currency, `%${data.search}%`)));
    const [foundDeals, total] = await Promise.all([
      db.select().from(deals).where(and(..._query)).orderBy(desc(deals.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ count: count() }).from(deals).where(and(..._query))
    ])
    return { deals: foundDeals, count: total[0]?.count ?? 0 }
  }

  public async update(
    tx: NodePgDatabase,
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
      await tx
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

  public async delete(tx: NodePgDatabase, data: VDeal.dealId & VDeal.organizationId) {
    return (
      await tx
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
