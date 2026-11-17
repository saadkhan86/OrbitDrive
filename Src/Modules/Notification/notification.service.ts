import { CustomError } from "../../ErrorHandler/CustomError";
import { IReply } from "../../Interfaces/IReply";
import { cusrorUtils } from "../../Utils/cursot.utils";
import { VAuth } from "../Auth/auth.validator";
import NotificationRepo from "./Notification.repo";
import { VNotification } from "./notification.validator";

export const notificationService = {
  query: async (user: VAuth.userId, query: VNotification.query): Promise<IReply.queryReturn> => {
    const decodedCursor = cusrorUtils.decode(query.cursor)
    const cursor = decodedCursor ? { id: decodedCursor.id, createdAt: new Date(decodedCursor.createdAt) } : null
    const notifications = await NotificationRepo.query({
      userId: user.userId,
      ...query,
      cursor
    });
    const hasNextPage = notifications.length > query.limit
    const data = notifications.slice(0, query.limit)
    const lastNotification = data[data.length - 1]
    const nextCursor = hasNextPage && lastNotification ? cusrorUtils.encode({ id: lastNotification.id, createdAt: new Date(lastNotification.createdAt).toISOString() }) : null
    return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
  },

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
