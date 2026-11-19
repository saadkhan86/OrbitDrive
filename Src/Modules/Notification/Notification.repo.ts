import { and, desc, eq, getTableColumns, inArray, lt, or, SQL } from "drizzle-orm";
import { notifications } from "../../Database/schemas/notification.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VAuth } from "../Auth/auth.validator";
import { db } from "../../Database";
import { VNotification } from "./notification.validator";
import { organizations } from "../../Database/schemas/organization.Schema";
import { ICursor } from "../../Interfaces/ICursor";
import notificationRefColumns from "./notification.refrence";
import organizationRefColumns from "../Organization/organization.refrence";

class NotificationRepo {
  public async create(tx: NodePgDatabase, data: typeof notifications.$inferInsert) {
    return (await tx.insert(notifications).values(data).returning())[0];
  }
  public async query(data: VAuth.userId & Omit<VNotification.query, "cursor"> & ICursor.query) {
    const _query: SQL[] = [eq(notifications.userId, data.userId)]
    if (data.cursor) {
      _query.push(
        or(
          lt(notifications.createdAt, data.cursor.createdAt),
          and(
            eq(notifications.createdAt, data.cursor.createdAt),
            lt(notifications.id, data.cursor.id)
          )
        )!
      )
    }
    return await db
      .select()
      .from(notifications)
      .where(
        and(..._query)
      )
      .orderBy(desc(notifications.createdAt), desc(notifications.id))
      .limit(data.limit + 1);
  }
  public async findById(data: VNotification.notificationId & VAuth.userId) {
    return (
      (
        await db
          .select({
            ...notificationRefColumns,
            organization: {
              ...organizationRefColumns
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
      )[0]
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
      )[0]
    );
  }
}

export default new NotificationRepo();
