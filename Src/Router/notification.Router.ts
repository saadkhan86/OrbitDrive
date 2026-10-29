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
