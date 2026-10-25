import type { FastifyInstance } from "fastify";
import { notificationController } from "../Controller/notification.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { notificationValidator } from "../Validators/notification.Validator";

export const notificationRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (routeOptions) => {
    routeOptions.schema = {
      ...routeOptions.schema,
      tags: ["Notifications"],
    };
  });

  app.get(
    "/",
    { preHandler: [authenticate.user] },
    notificationController.findAll,
  );

  app.patch(
    "/read",
    {
      preHandler: [authenticate.user],
      schema: {
        body: notificationValidator.markAsRead,
      },
    },
    notificationController.markManyAsRead,
  );

  app.get(
    "/:notificationId",
    { preHandler: [authenticate.user] },
    notificationController.findById,
  );

  app.patch(
    "/:notificationId/read",
    { preHandler: [authenticate.user] },
    notificationController.markAsRead,
  );

  app.delete(
    "/:notificationId",
    { preHandler: [authenticate.user] },
    notificationController.delete,
  );
};
