import dealRepo from "../Repositories/deal.Repo";
import ClientRepo from "../Repositories/Client.Repo";
import TaskRepo from "../Repositories/Task.Repo";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { CustomError } from "../Errors/CustomError";
import type { VTask } from "../Validators/task.Validator";
import type { VAuth } from "../Validators/auth.Validator";
import notificationRepo from "../Repositories/notification.Repo";
import { db } from "../Database";

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

    const createdTask = await db.transaction(async (tx) => {
      const task = await TaskRepo.create(tx, {
        ...data,
        organizationId: organization.organizationId,
      });
      if (!task) throw new CustomError(500, "task not created", "SERVER_ERROR")
      await auditLogRepo.create(tx, {
        organizationId: organization.organizationId,
        userId: user.userId,
        action: "create",
        entityType: "task",
        entityId: task.id,
        metadata: {
          title: task.title,
          assignedTo: task.assignedTo,
          clientId: task.clientId,
          dealId: task.dealId,
          priority: task.priority,
          status: task.status,
        },
      });
      notificationRepo.create(tx, {
        type: "task_assigned",
        userId: task!.assignedTo,
        organizationId: organization.organizationId,
        title: "New Task Assigned",
      })
    })
    return createdTask;
  },

  findById: async (taskId: VTask.taskId) => {
    const task = await TaskRepo.findById({ ...taskId });

    if (!task) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    return task;
  },

  query: async (organization: VTask.organizationId, query: VTask.query) => {
    const tasks = await TaskRepo.query({ ...organization, ...query });
    return tasks;
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

    const updatedTask = await db.transaction(async (tx) => {
      const updated = await TaskRepo.update(tx, { ...task, ...data });
      if (!updated) throw new CustomError(500, "task not updated", "SERVER_ERROR")
      await auditLogRepo.create(tx, {
        organizationId: updated!.organizationId,
        userId: user.userId,
        action: "update",
        entityType: "task",
        entityId: updated.id,
        metadata: {
          previous: {
            title: existingTask.title,
            assignedTo: existingTask.assignedTo,
            status: existingTask.status,
            priority: existingTask.priority,
          },
          updated: {
            title: updated.title,
            assignedTo: updated.assignedTo,
            status: updated.status,
            priority: updated.priority,
          },
        },
      });

    })
    return updatedTask;
  },

  delete: async (user: VAuth.userId, task: VTask.taskId) => {
    const existingTask = await TaskRepo.findById({ ...task });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      await TaskRepo.delete(tx, { ...task });
      await auditLogRepo.create(tx, {
        organizationId: existingTask.organizationId,
        userId: user.userId,
        action: "delete",
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
    })

    return true;
  },
};
