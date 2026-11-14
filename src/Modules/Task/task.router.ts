import type { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { authorize } from "../../Hooks/authorization.hook";
import { taskValidator } from "./task.validator";
import { taskController } from "./task.controller";

export const taskRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = {
      ...route.schema,
      tags: ["Tasks"],
    };
  });
  app.addHook("preHandler", authenticate.user)
  app.post(
    "/",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin"])],
      schema: {
        params: taskValidator.organizationId,
        body: taskValidator.create,
      },
    },
    taskController.create,
  );

  app.get(
    "/",
    {
      preHandler: [authorize.role()],
      schema: {
        params: taskValidator.organizationId,
        querystring: taskValidator.query
      },
    },
    taskController.query,
  );

  app.get(
    "/:taskId",
    {
      preHandler: [authorize.role()],
      schema: {
        params: taskValidator.taskId,
      },
    },
    taskController.findById,
  );

  app.patch(
    "/:taskId",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin", "member"])],
      schema: {
        params: taskValidator.taskId,
        body: taskValidator.update,
      },
    },
    taskController.update,
  );

  app.delete(
    "/:taskId",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin"])],
      schema: {
        params: taskValidator.taskId,
      },
    },
    taskController.delete,
  );
};
