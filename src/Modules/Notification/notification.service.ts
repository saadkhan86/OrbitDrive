import { CustomError } from "../errorHandler/CustomError";
import notificationRepo from "../repositories/Notification.repo";
import { VAuth } from "../validators/auth.validator";
import type { VNotification } from "../validators/notification.validator";

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
      userId: user.userId,
    });

    if (!data) {
      throw new CustomError(
        404,
        "Notification not found",
        "NOTIFICATION_NOT_FOUND",
      );
    }

    return data;
  },



  markAsRead: async (
    user: VAuth.userId,
    notificationArray: VNotification.notificationArray,
  ) => {
    return await notificationRepo.markAsRead({
      userId: user.userId,
      ...notificationArray,
    });
  },

  // Delete notification
  delete: async (
    notificationArray: VNotification.notificationArray,
    user: VAuth.userId,
  ) => {
    return await notificationRepo.delete({
      ...notificationArray,
      userId: user.userId,
    });
  },
};
