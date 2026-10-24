import type { FastifyReply, FastifyRequest } from "fastify";

import { taskService } from "../Services/task.Service";
import { VTask } from "../Validators/task.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const taskController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.create(
      request.user as VAuth.userId,
      request.params as VTask.organizationId,
      request.body as VTask.create,
    );

    return reply.code(201).send({
      success: true,
      data: task,
    });
  },

  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.findById(request.params as VTask.taskId);

    return reply.code(200).send({
      success: true,
      data: task,
    });
  },

  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const tasks = await taskService.query(
      request.params as VTask.organizationId,
      request.query as VTask.query
    );

    return reply.code(200).send({
      success: true,
      data: { result: tasks },
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.update(
      request.user as VAuth.userId,
      request.params as VTask.taskId,
      request.body as VTask.update,
    );

    return reply.code(200).send({
      success: true,
      data: task,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await taskService.delete(
      request.user as VAuth.userId,
      request.params as VTask.taskId,
    );

    return reply.code(204).send({
      success: true,
      message: "task deleted successfully",
      data: { task: true },
    });
  },
};
