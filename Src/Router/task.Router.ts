import type { FastifyInstance } from "fastify";

import { taskController } from "../Controller/task.Controller";
import { taskValidator } from "../Validators/task.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";

export const taskRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = {
      ...route.schema,
      tags: ["Tasks"],
    };
  });

  app.post(
    "/",
    {
      preHandler: [authenticate.user],
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
      preHandler: [authenticate.user],
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
      preHandler: [authenticate.user],
      schema: {
        params: taskValidator.taskId,
      },
    },
    taskController.findById,
  );

  app.patch(
    "/:taskId",
    {
      preHandler: [authenticate.user],
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
      preHandler: [authenticate.user],
      schema: {
        params: taskValidator.taskId,
      },
    },
    taskController.delete,
  );
};
