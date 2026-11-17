import z from "zod";

export const notificationValidator = {
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().default(10)
  }),
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
  type query = z.infer<typeof notificationValidator.query>
  type notificationArray = z.infer<typeof notificationValidator.notificationArray>;
}
