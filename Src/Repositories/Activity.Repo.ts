import { and, count, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";
import { db } from "../Database";
import { activities } from "../Database/Schemas/activity.Schema";
import { VActivity } from "../Validators/activity.Validator";
import { NodePgClient, NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../Database/Schemas/users.Schema";
import { clients } from "../Database/Schemas/clients.Schema";
import { deals } from "../Database/Schemas/deals.Schema";

class ActivityRepo {
  public async create(
    tx: NodePgDatabase,
    data: VActivity.create & {
      organizationId: string;
      userId: string;
    },
  ) {
    return (
      await tx
        .insert(activities)
        .values({
          organizationId: data.organizationId,
          clientId: data.clientId,
          dealId: data.dealId,
          userId: data.userId,
          type: data.type,
          title: data.title,
          description: data.description,
          occurredAt: data.occurredAt,
        })
        .returning()
    )[0];
  }

  public async query(data: VActivity.organizationId & VActivity.query) {
    const { page = 1, limit = 10 } = data
    const _query: any[] = [eq(activities.organizationId, data.organizationId)];
    if (data.type) {
      _query.push(eq(activities.type, data.type));
    }
    if (data.search) {
      _query.push(or(ilike(activities.title, `%${data.search}%`)));
    }
    const [foundActivities, total] = await Promise.all([
      db
        .select()
        .from(activities)
        .where(and(..._query))
        .orderBy(desc(activities.occurredAt)).limit(limit).offset((page - 1) * limit),
      db
        .select({ count: count() })
        .from(activities)
        .where(and(..._query))
    ])
    return { activities: foundActivities, count: total[0]?.count ?? 0 }
  }

  public async findById(data: VActivity.activityId) {
    return (
      (
        await db
          .select({
            ...getTableColumns(activities),
            user: { name: users.fullName },
            client: { name: clients.name },
            deal: { name: deals.title },
          })
          .from(activities)
          .leftJoin(users, eq(activities.userId, users.id))
          .leftJoin(clients, eq(activities.clientId, clients.id))
          .leftJoin(deals, eq(activities.dealId, deals.id))
          .where(
            and(
              eq(activities.id, data.activityId),
              eq(activities.organizationId, data.organizationId),
            ),
          )
          .limit(1)
      )[0] ?? null
    );
  }

  public async findByClient(
    data: VActivity.clientId & VActivity.organizationId,
  ) {
    return await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.clientId, data.clientId),
          eq(activities.organizationId, data.organizationId),
        ),
      )
      .orderBy(desc(activities.occurredAt));
  }

  public async findByDeal(data: VActivity.dealId & VActivity.organizationId) {
    return await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.dealId, data.dealId),
          eq(activities.organizationId, data.organizationId),
        ),
      )
      .orderBy(desc(activities.occurredAt));
  }

  public async update(tx: NodePgDatabase, data: VActivity.activityId & VActivity.update) {
    const newData: Partial<typeof activities.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.title) newData.title = data.title;
    if (data.description) newData.description = data.description;
    if (data.occurredAt) newData.occurredAt = data.occurredAt;
    if (data.type) newData.type = data.type;

    return (
      (
        await tx
          .update(activities)
          .set(newData)
          .where(
            and(
              eq(activities.id, data.activityId),
              eq(activities.organizationId, data.organizationId),
            ),
          )
          .returning()
      )[0] ?? null
    );
  }

  public async delete(tx: NodePgDatabase, data: VActivity.activityId) {
    return (await tx
      .delete(activities)
      .where(
        and(
          eq(activities.id, data.activityId),
          eq(activities.organizationId, data.organizationId),
        ),
      )
      .returning())[0] ?? null;

  }
}

export default new ActivityRepo();
