import type { FastifyInstance } from "fastify";
import { activityValidator } from "../Validators/activity.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
import { activityController } from "../Controller/activity.Controller";

export const activityRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = {
      ...route.schema,
      tags: ["Activities"],
    };
  });

  // Create activity
  app.post(
    "/",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.organizationId,
        body: activityValidator.create,
      },
    },
    activityController.create,
  );

  // Get all activities
  app.get(
    "/",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.organizationId,
      },
    },
    activityController.findAll,
  );

  // Get activity by ID
  app.get(
    "/:activityId",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.activityId,
      },
    },
    activityController.findById,
  );

  // Get activities by client
  app.get(
    "/client/:clientId",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.clientId,
      },
    },
    activityController.findByClient,
  );

  // Get activities by deal
  app.get(
    "/deal/:dealId",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.dealId,
      },
    },
    activityController.findByDeal,
  );

  // Update activity
  app.patch(
    "/:activityId",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.activityId,
        body: activityValidator.update,
      },
    },
    activityController.update,
  );

  // Delete activity
  app.delete(
    "/:activityId",
    {
      preHandler: [authenticate.user],
      schema: {
        params: activityValidator.activityId,
      },
    },
    activityController.delete,
  );
};
