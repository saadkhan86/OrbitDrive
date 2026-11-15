import { and, desc, eq, getTableColumns, inArray } from "drizzle-orm";
import { notifications } from "../../Database/schemas/notification.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VAuth } from "../Auth/auth.validator";
import { db } from "../../Database";
import { VNotification } from "./notification.validator";
import { organizations } from "../../Database/schemas/organization.Schema";

class NotificationRepo {
  public async create(tx: NodePgDatabase, data: typeof notifications.$inferInsert) {
    return (await tx.insert(notifications).values(data).returning())[0];
  }

  public async query(data: VAuth.userId) {
    return await db
      .select()
      .from(notifications)
      .where(
        eq(notifications.userId, data.userId)
      )
      .orderBy(desc(notifications.createdAt));
  }

  public async findById(data: VNotification.notificationId & VAuth.userId) {
    return (
      (
        await db
          .select({
            ...getTableColumns(notifications), organization: {
              name: organizations.name
            }
          })
          .from(notifications)
          .innerJoin(organizations, eq(organizations.id, notifications.organizationId))
          .where(
            and(
              eq(notifications.id, data.notificationId),
              eq(notifications.userId, data.userId),
            ),
          )
          .limit(1)
      )[0] ?? null
    );
  }

  public async markAsRead(
    data: VNotification.notificationArray & VAuth.userId,
  ) {
    return await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.userId, data.userId),
          inArray(notifications.id, data.notificationIds),
        ),
      )
      .returning();
  }

  // Delete notification
  public async delete(data: VNotification.notificationArray & VAuth.userId) {
    return (
      (
        await db
          .delete(notifications)
          .where(
            and(
              eq(notifications.userId, data.userId),
              inArray(notifications.id, data.notificationIds),
            ),
          )
          .returning()
      )[0] ?? null
    );
  }
}

export default new NotificationRepo();
