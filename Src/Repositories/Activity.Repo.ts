import { and, desc, eq } from "drizzle-orm";
import { db } from "../Database";
import { activities } from "../Database/Schemas/activity.Schema";
import { VActivity } from "../Validators/activity.Validator";

class ActivityRepo {
  public async create(
    data: VActivity.create & {
      organizationId: string;
      userId: string;
    },
  ) {
    return (
      await db
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

  public async findById(data: VActivity.activityId) {
    return (
      (
        await db
          .select()
          .from(activities)
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

  public async findAll(data: VActivity.organizationId) {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.organizationId, data.organizationId))
      .orderBy(desc(activities.occurredAt));
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

  public async update(data: VActivity.activityId & VActivity.update) {
    const newData: Partial<typeof activities.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.title) newData.title = data.title;
    if (data.description) newData.description = data.description;
    if (data.occurredAt) newData.occurredAt = data.occurredAt;
    if (data.type) newData.type = data.type;

    return (
      (
        await db
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

  public async delete(data: VActivity.activityId) {
    const [activity] = await db
      .delete(activities)
      .where(
        and(
          eq(activities.id, data.activityId),
          eq(activities.organizationId, data.organizationId),
        ),
      )
      .returning();

    return activity ?? null;
  }
}

export default new ActivityRepo();
