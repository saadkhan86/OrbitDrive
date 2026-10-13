import { and, desc, eq, inArray } from "drizzle-orm";

import type { VNotification } from "../Validators/notification.Validator";
import { db } from "../Database";
import { notifications } from "../Database/Schemas/notification.Schema";
import { VOrganization } from "../Validators/organization.Validator";
import { VAuth } from "../Validators/auth.Validator";

class NotificationRepo {
  public async create(data: typeof notifications.$inferInsert) {
    return (await db.insert(notifications).values(data).returning())[0];
  }

  public async findAll(data: VOrganization.getById & VAuth.userId) {
    return await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.organizationId, data.organizationId),
          eq(notifications.userId, data.userId),
        ),
      )
      .orderBy(desc(notifications.createdAt));
  }

  public async findById(data: VNotification.notificationId & VAuth.userId) {
    return (
      (
        await db
          .select()
          .from(notifications)
          .where(
            and(
              eq(notifications.id, data.notificationId),
              eq(notifications.organizationId, data.organizationId),
              eq(notifications.userId, data.userId),
            ),
          )
          .limit(1)
      )[0] ?? null
    );
  }
  public async markAsRead(data: VNotification.notificationId & VAuth.userId) {
    return (
      await db
        .update(notifications)
        .set({
          isRead: true,
          readAt: new Date(),
        })
        .where(
          and(
            eq(notifications.id, data.notificationId),
            eq(notifications.organizationId, data.organizationId),
            eq(notifications.userId, data.userId),
          ),
        )
        .returning()
    )[0]
      ? true
      : false;
  }

  public async markManyAsRead(
    data: VNotification.markAsRead & VOrganization.getById & VAuth.userId,
  ) {
    return await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.organizationId, data.organizationId),
          eq(notifications.userId, data.userId),
          inArray(notifications.id, data.notificationIds),
        ),
      )
      .returning();
  }

  // Delete notification
  public async delete(data: VNotification.notificationId & VAuth.userId) {
    return (
      (
        await db
          .delete(notifications)
          .where(
            and(
              eq(notifications.id, data.notificationId),
              eq(notifications.organizationId, data.organizationId),
              eq(notifications.userId, data.userId),
            ),
          )
          .returning()
      )[0] ?? null
    );
  }
}

export default new NotificationRepo();
