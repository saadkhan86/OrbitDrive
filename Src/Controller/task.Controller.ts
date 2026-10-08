import type { FastifyReply, FastifyRequest } from "fastify";

import { taskService } from "../Services/task.Service";
import { VTask } from "../Validators/task.Validator";

export const taskController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.create(
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

  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const tasks = await taskService.findAll(
      request.params as VTask.organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: tasks,
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const task = await taskService.update(
      request.params as VTask.taskId,
      request.body as VTask.update,
    );

    return reply.code(200).send({
      success: true,
      data: task,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    await taskService.delete(request.params as VTask.taskId);

    return reply.code(204).send({
      success: true,
      message: "task deleted successfully",
      data: [],
    });
  },
};
