import dealRepo from "../Repositories/deal.Repo";
import type { VTask } from "../Validators/task.Validator";
import ClientRepo from "../Repositories/Client.Repo";
import { CustomError } from "../Errors/CustomError";
import TaskRepo from "../Repositories/Task.Repo";

export const taskService = {
  create: async (organization: VTask.organizationId, data: VTask.create) => {
    if (data.clientId) {
      const client = await ClientRepo.getById({
        clientId: data.clientId,
        organizationId: organization.organizationId,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (data.dealId) {
      const deal = await dealRepo.findById({
        dealId: data.dealId,
        organizationId: organization.organizationId,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      if (data.clientId && deal.clientId !== data.clientId) {
        throw new CustomError(
          400,
          "Deal does not belong to the specified client",
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    return await TaskRepo.create({
      ...data,
      organizationId: organization.organizationId,
    });
  },

  findById: async (taskId: VTask.taskId) => {
    const task = await TaskRepo.findById({ ...taskId });

    if (!task) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    return task;
  },

  findAll: async (organization: VTask.organizationId) => {
    return await TaskRepo.getAll({ ...organization });
  },

  update: async (task: VTask.taskId, data: VTask.update) => {
    const existingTask = await TaskRepo.findById({ ...task, ...data });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    return await TaskRepo.update({ ...task, ...data });
  },

  delete: async (task: VTask.taskId) => {
    const existingTask = await TaskRepo.findById({ ...task });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    return await TaskRepo.delete({ ...task });
  },
};
