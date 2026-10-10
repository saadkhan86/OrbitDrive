import { and, desc, eq } from "drizzle-orm";
import { db } from "../Database";
import { activities } from "../Database/Schemas/activity.Schema";


class ActivityRepo {
  // Create activity
  public async create(
    data: VActivity.create & {
      organizationId: string;
      userId: string;
    },
  ) {
    const [activity] = await db
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
      .returning();

    return activity;
  }

  // Find activity by ID within an organization
  public async findById(
    activityId: string,
    organizationId: string,
  ) {
    const [activity] = await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.id, activityId),
          eq(activities.organizationId, organizationId),
        ),
      )
      .limit(1);

    return activity ?? null;
  }

  // Get all activities of an organization
  public async findAll(organizationId: string) {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.organizationId, organizationId))
      .orderBy(desc(activities.occurredAt));
  }

  // Get activities of a specific client
  public async findByClient(
    clientId: string,
    organizationId: string,
  ) {
    return await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.clientId, clientId),
          eq(activities.organizationId, organizationId),
        ),
      )
      .orderBy(desc(activities.occurredAt));
  }

  // Get activities of a specific deal
  public async findByDeal(
    dealId: string,
    organizationId: string,
  ) {
    return await db
      .select()
      .from(activities)
      .where(
        and(
          eq(activities.dealId, dealId),
          eq(activities.organizationId, organizationId),
        ),
      )
      .orderBy(desc(activities.occurredAt));
  }

  // Update activity
  public async update(
    activityId: string,
    organizationId: string,
    data: VActivity.update,
  ) {
    const [activity] = await db
      .update(activities)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(activities.id, activityId),
          eq(activities.organizationId, organizationId),
        ),
      )
      .returning();

    return activity ?? null;
  }

  // Delete activity
  public async delete(
    activityId: string,
    organizationId: string,
  ) {
    const [activity] = await db
      .delete(activities)
      .where(
        and(
          eq(activities.id, activityId),
          eq(activities.organizationId, organizationId),
        ),
      )
      .returning();

    return activity ?? null;
  }
}

export default new ActivityRepo();
