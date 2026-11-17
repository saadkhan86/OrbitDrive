import { db } from "../../Database";
import { CustomError } from "../../ErrorHandler/CustomError";
import { getIo } from "../../Socket/server.socket";
import { cusrorUtils } from "../../Utils/cursot.utils";
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
    const createdTask = await db.transaction(async (tx) => {
      const task = await TaskRepo.create(tx, {
        ...body,
        organizationId: param.organizationId,
      });
      if (!task) throw new CustomError(500, "task not created", "SOMETHING_WENT_WRONG")
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
      return task
    })
    getIo().to(createdTask.assignedTo).emit("new-notification", createdTask)
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
    const decodedCursor = cusrorUtils.decode(query.cursor)
    const cursor = decodedCursor ? { createdAt: new Date(decodedCursor.createdAt), id: decodedCursor.id } : null
    const tasks = await TaskRepo.query({ ...param, ...query, cursor });
    const hasNextPage = tasks.length > query.limit
    const data = tasks.slice(0, query.limit)
    const lastTask = data[data.length - 1]
    const nextCursor = hasNextPage && lastTask ?
      cusrorUtils.encode({
        createdAt: lastTask.createdAt!.toISOString(),
        id: lastTask.id
      }) : null
    return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } };
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
    await db.transaction(async (tx) => {
      const deleted = await TaskRepo.delete(tx, { ...param });
      if (!deleted) throw new CustomError(404, "task not found", "NOT_FOUND")
      await AuditLogRepo.create(tx, {
        organizationId: deleted.organizationId,
        userId: user.userId,
        action: "delete",
        entityType: "task",
        entityId: deleted.id,
        metadata: {
          title: deleted.title,
          assignedTo: deleted.assignedTo,
          clientId: deleted.clientId,
          dealId: deleted.dealId,
          status: deleted.status,
        },
      });
    })

    return true;
  },
};
