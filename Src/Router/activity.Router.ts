import type { FastifyInstance } from "fastify";
import { activityValidator } from "../Validators/activity.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
import { activityController } from "../Controller/activity.Controller";
import { authorize } from "../Hooks/authorization.Hook";

export const activityRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = {
      ...route.schema,
      tags: ["Activities"],
    };
  });

  app.post(
    "/",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authenticate.user, authorize.role()],
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
      preHandler: [authenticate.user, authorize.role()],
      schema: {
        params: activityValidator.organizationId,
        querystring: activityValidator.query
      },
    },
    activityController.query,
  );

  // Get activity by ID
  app.get(
    "/:activityId",
    {
      preHandler: [authenticate.user, authorize.role()],
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
      preHandler: [authenticate.user, authorize.role()],
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
      preHandler: [authenticate.user, authorize.role()],
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

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authenticate.user, authorize.role(["admin", "member", "owner"])],
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

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authenticate.user, authorize.role(["owner", "admin"])],
      schema: {
        params: activityValidator.activityId,
      },
    },
    activityController.delete,
  );
};
