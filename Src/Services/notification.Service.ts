import { CustomError } from "../Errors/CustomError";
import notificationRepo from "../Repositories/notification.Repo";
import { VAuth } from "../Validators/auth.Validator";
import type { VNotification } from "../Validators/notification.Validator";
import { VOrganization } from "../Validators/organization.Validator";

export const notificationService = {
  // Get all notifications
  findAll: async (user: VAuth.userId) => {
    return await notificationRepo.findAll({
      userId: user.userId,
    });
  },

  // Get notification by ID
  findById: async (
    notification: VNotification.notificationId,
    user: VAuth.userId,
  ) => {
    const data = await notificationRepo.findById({
      notificationId: notification.notificationId,
      organizationId: notification.organizationId,
      userId: user.userId,
    });

    if (!data) {
      throw new CustomError(
        404,
        "Notification not found",
        "NOTIFICATION_NOT_FOUND",
      );
    }

    return notification;
  },

  // Mark one notification as read
  markAsRead: async (
    notification: VNotification.notificationId,
    user: VAuth.userId,
  ) => {
    return await notificationRepo.markAsRead({
      notificationId: notification.notificationId,
      organizationId: notification.organizationId,
      userId: user.userId,
    });
  },

  // Mark multiple notifications as read
  markManyAsRead: async (
    organization: VOrganization.getById,
    user: VAuth.userId,
    data: VNotification.markAsRead,
  ) => {
    return await notificationRepo.markManyAsRead({
      organizationId: organization.organizationId,
      userId: user.userId,
      ...data,
    });
  },

  // Delete notification
  delete: async (
    notification: VNotification.notificationId,
    user: VAuth.userId,
  ) => {
    return await notificationRepo.delete({
      notificationId: notification.notificationId,
      organizationId: notification.organizationId,
      userId: user.userId,
    });
  },
};
