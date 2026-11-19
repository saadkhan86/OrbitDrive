import { and, count, desc, eq, ilike, lt, or, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VActivity } from "./activity.validator";
import { activities } from "../../Database/schemas/activity.Schema";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { clients } from "../../Database/schemas/clients.Schema";
import { deals } from "../../Database/schemas/deals.Schema";
import { ICursor } from "../../Interfaces/ICursor";
import activityRefColumns from "./activity.refrence";
import userRefColumns from "../User/user.reference";
import clientRefColumns from "../Client/client.refrence";
import dealRefColumns from "../Deal/deal.refrence";

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
  public async query(data: VActivity.organizationId & Omit<VActivity.query, "cursor"> & ICursor.query) {
    const _query: SQL[] = [eq(activities.organizationId, data.organizationId)];
    if (data.type) {
      _query.push(eq(activities.type, data.type));
    }
    if (data.search) {
      _query.push(or(ilike(activities.title, `%${data.search}%`)) as SQL);
    }
    if (data.cursor) {
      _query.push(
        or(
          lt(activities.createdAt, data.cursor.createdAt),
          and(
            eq
              (activities.createdAt, data.cursor.createdAt),
            lt
              (activities.id, data.cursor.id)
          )
        )!
      )
    }
    return await
      db
        .select()
        .from(activities)
        .where(and(..._query))
        .orderBy(desc(activities.createdAt), desc(activities.id))
        .limit(data.limit + 1)

  }
  public async findById(data: VActivity.activityId) {
    return (
      await db
        .select({
          ...activityRefColumns,
          user: { ...userRefColumns },
          client: { ...clientRefColumns },
          deal: { ...dealRefColumns },
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
    )[0]

  }
  public async findByClient(
    data: VActivity.clientId & VActivity.organizationId,
  ) {
    return await db
      .select({
        ...activityRefColumns,
        client: {
          ...clientRefColumns
        },
        user: {
          ...userRefColumns
        }
      })
      .from(activities)
      .innerJoin(clients, eq(clients.id, activities.clientId))
      .innerJoin(users, eq(users.id, activities.userId))
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
      .select({
        ...dealRefColumns,
        deal: {
          ...dealRefColumns
        },
        user: {
          ...userRefColumns
        }
      })
      .from(activities)
      .innerJoin(deals, eq(deals.id, activities.dealId))
      .innerJoin(users, eq(users.id, activities.userId))
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
