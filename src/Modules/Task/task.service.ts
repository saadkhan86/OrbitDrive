import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "../AuditLog/AuditLog.repo";
import { VAuth } from "../Auth/auth.validator";
import ClientRepo from "../Clients/Client.repo";
import DealRepo from "../Deal/Deal.repo";
import NotificationRepo from "../Notification/Notification.repo";
import TaskRepo from "./Task.repo";
import { VTask } from "./task.validator";

export const taskService = {
  create: async (
    user: VAuth.userId,
    param: VTask.organizationId,
    body: VTask.create,
  ) => {
    if (body.clientId) {
      const client = await ClientRepo.getById({
        clientId: body.clientId,
        organizationId: param.organizationId,
      });

      if (!client) {
        throw new CustomError(404, "Client not found", "CLIENT_NOT_FOUND");
      }
    }

    if (body.dealId) {
      const deal = await DealRepo.findById({
        dealId: body.dealId,
        organizationId: param.organizationId,
      });

      if (!deal) {
        throw new CustomError(404, "Deal not found", "DEAL_NOT_FOUND");
      }

      if (body.clientId && deal.clientId !== body.clientId) {
        throw new CustomError(
          400,
          "Deal does not belong to the specified client",
          "DEAL_CLIENT_MISMATCH",
        );
      }
    }

    const createdTask = await db.transaction(async (tx) => {
      const task: NonNullable<any> = await TaskRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
      });
      await AuditLogRepo.create(tx, {
        organizationId: param.organizationId,
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
      NotificationRepo.create(tx, {
        type: "task_assigned",
        userId: task!.assignedTo,
        organizationId: param.organizationId,
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

  query: async (param: VTask.organizationId, query: VTask.query) => {
    const tasks = await TaskRepo.query({ ...param, ...query });
    return tasks;
  },

  update: async (
    user: VAuth.userId,
    param: VTask.taskId,
    body: VTask.update,
  ) => {
    const existingTask = await TaskRepo.findById({ ...param });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    const updatedTask = await db.transaction(async (tx) => {
      const updated = await TaskRepo.update(tx, { ...param, ...body });
      if (!updated) throw new CustomError(500, "task not updated", "SERVER_ERROR")
      await AuditLogRepo.create(tx, {
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

  delete: async (user: VAuth.userId, param: VTask.taskId) => {
    const existingTask = await TaskRepo.findById({ ...param });

    if (!existingTask) {
      throw new CustomError(404, "Task not found", "TASK_NOT_FOUND");
    }

    await db.transaction(async (tx) => {
      await TaskRepo.delete(tx, { ...param });
      await AuditLogRepo.create(tx, {
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
