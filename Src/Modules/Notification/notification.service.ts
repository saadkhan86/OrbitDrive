import { CustomError } from "../../ErrorHandler/CustomError";
import { VAuth } from "../Auth/auth.validator";
import NotificationRepo from "./Notification.repo";
import { VNotification } from "./notification.validator";

export const notificationService = {
  // Get all notifications
  query: async (user: VAuth.userId) => {
    return await NotificationRepo.query({
      userId: user.userId,
    });
  },

  // Get notification by ID
  findById: async (
    param: VNotification.notificationId,
    user: VAuth.userId,
  ) => {
    const data = await NotificationRepo.findById({
      notificationId: param.notificationId,
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
    body: VNotification.notificationArray,
  ) => {
    return await NotificationRepo.markAsRead({
      userId: user.userId,
      ...body,
    });
  },

  // Delete notification
  delete: async (
    user: VAuth.userId,
    body: VNotification.notificationArray,
  ) => {
    return await NotificationRepo.delete({
      ...body,
      userId: user.userId,
    });
  },
};
