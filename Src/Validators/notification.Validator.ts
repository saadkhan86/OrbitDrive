import z from "zod";

export const notificationValidator = {
  notificationId: z.object({
    notificationId: z
      .string({ message: "Invalid notificationId" })
      .uuid({ message: "Invalid notificationId" }),
  }),

  markAsRead: z.object({
    notificationIds: z
      .array(
        z
          .string({ message: "Invalid notification ID" })
          .uuid({ message: "Invalid notification ID" }),
        { message: "Notification IDs must be an array" },
      )
      .min(1, { message: "At least one notification ID is required" }),
  }),
};

export declare namespace VNotification {
  type notificationId = z.infer<typeof notificationValidator.notificationId>;

  type markAsRead = z.infer<typeof notificationValidator.markAsRead>;
}
