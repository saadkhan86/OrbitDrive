import { VAuth } from "../Auth/auth.validator";
import NotificationRepo from "./Notification.repo";

export const notificationService = {
  // Get all notifications
  query: async (user: VAuth.userId) => {
    return await NotificationRepo.query({
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
