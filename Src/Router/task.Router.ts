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

  // Create task
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

  // Get all tasks
  app.get(
    "/",
    {
      preHandler: [authenticate.user],
      schema: {
        params: taskValidator.organizationId,
      },
    },
    taskController.findAll,
  );

  // Get task by ID
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

  // Update task
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

  // Delete task
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
