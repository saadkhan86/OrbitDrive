import type { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { notificationController } from "./notification.controller";
import { notificationValidator } from "./notification.validator";

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
    notificationController.query,
  );
  app.get(
    "/:notificationId",
    { preHandler: [authenticate.user] },
    notificationController.findById,
  );
  app.patch(
    "/read",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authenticate.user],
      schema: {
        body: notificationValidator.notificationArray,
      },
    },
    notificationController.markAsRead,
  );

  app.delete(
    "/delete",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } }, preHandler: [authenticate.user], schema: { body: notificationValidator.notificationArray }
    },
    notificationController.delete,
  );
};
