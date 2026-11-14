import z from "zod";

export const notificationValidator = {
  notificationId: z.object({
    notificationId: z
      .uuid({ message: "Invalid notificationId" }),
  }),

  notificationArray: z.object({
    notificationIds: z
      .array(z.uuid({ message: "Invalid notification ID" }), {
        message: "Notification IDs must be an array",
      })
      .min(1, { message: "At least one notification ID is required" }),
  }),
};

export declare namespace VNotification {
  type notificationId = z.infer<typeof notificationValidator.notificationId>;

  type notificationArray = z.infer<typeof notificationValidator.notificationArray>;
}
