import dealRepo from "../Repositories/deal.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import TaskRepo from "../Repositories/Task.Repo";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { CustomError } from "../Errors/CustomError";
import type { VTask } from "../Validators/task.Validator";
import type { VAuth } from "../Validators/auth.Validator";

export const taskService = {
  create: async (
    user: VAuth.userId,
    organization: VTask.organizationId,
    data: VTask.create,
  ) => {
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

    const createdTask = await TaskRepo.create({
      ...data,
      organizationId: organization.organizationId,
    });

    if (!createdTask) {
      throw new CustomError(
        500,
        "Something went wrong while creating task",
        "SOMETHING_WENT_WRONG",
      );
    }

    await auditLogRepo.create({
      organizationId: organization.organizationId,
      userId: user.userId,
      action: "TASK_CREATED",
      entityType: "task",
      entityId: createdTask.id,
      metadata: {
        title: createdTask.title,
        assignedTo: createdTask.assignedTo,
        clientId: createdTask.clientId,
        dealId: createdTask.dealId,
        priority: createdTask.priority,
        status: createdTask.status,
      },
    });

    return createdTask;
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

  update: async (
    user: VAuth.userId,
    task: VTask.taskId,
    data: VTask.update,
  ) => {
    const existingTask = await TaskRepo.findById({ ...task });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    const updatedTask = await TaskRepo.update({ ...task, ...data });

    if (!updatedTask) {
      throw new CustomError(
        500,
        "Something went wrong while updating task",
        "SOMETHING_WENT_WRONG",
      );
    }

    await auditLogRepo.create({
      organizationId: updatedTask.organizationId,
      userId: user.userId,
      action: "TASK_UPDATED",
      entityType: "task",
      entityId: updatedTask.id,
      metadata: {
        previous: {
          title: existingTask.title,
          assignedTo: existingTask.assignedTo,
          status: existingTask.status,
          priority: existingTask.priority,
        },
        updated: {
          title: updatedTask.title,
          assignedTo: updatedTask.assignedTo,
          status: updatedTask.status,
          priority: updatedTask.priority,
        },
      },
    });

    return updatedTask;
  },

  delete: async (user: VAuth.userId, task: VTask.taskId) => {
    const existingTask = await TaskRepo.findById({ ...task });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    const deletedTask = await TaskRepo.delete({ ...task });

    if (!deletedTask) {
      throw new CustomError(
        500,
        "Something went wrong while deleting task",
        "SOMETHING_WENT_WRONG",
      );
    }

    await auditLogRepo.create({
      organizationId: existingTask.organizationId,
      userId: user.userId,
      action: "TASK_DELETED",
      entityType: "task",
      entityId: existingTask.id,
      metadata: {
        title: existingTask.title,
        assignedTo: existingTask.assignedTo,
        clientId: existingTask.clientId,
        dealId: existingTask.dealId,
        status: existingTask.status,
      },
    });

    return deletedTask;
  },
};
