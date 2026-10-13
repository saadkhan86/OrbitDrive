import type { FastifyReply, FastifyRequest } from "fastify";
import { notificationService } from "../Services/notification.Service";
import { VNotification } from "../Validators/notification.Validator";
import { VActivity } from "../Validators/activity.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const notificationController = {
  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const notifications = await notificationService.findAll(
      request.params as VNotification.organizationId,
      request.user as VAuth.userId,
    );

    return reply.status(200).send({
      success: true,
      message: "notifications fetched successfully",
      data: notifications,
    });
  },

  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const notification = await notificationService.findById(
      request.params as VNotification.notificationId,
      request.user as VAuth.userId,
    );

    return reply.status(200).send({
      success: true,
      message: "notification returned successfully",
      data: notification,
    });
  },

  markAsRead: async (request: FastifyRequest, reply: FastifyReply) => {
    const notification = await notificationService.markAsRead(
      request.params as VNotification.notificationId,
      request.user as VAuth.userId,
    );

    return reply.status(200).send({
      success: true,
      message: "notification read successfully",
      data: notification,
    });
  },

  markManyAsRead: async (request: FastifyRequest, reply: FastifyReply) => {
    const notifications = await notificationService.markManyAsRead(
      request.params as VNotification.organizationId,
      request.user as VAuth.userId,
      request.body as VNotification.markAsRead,
    );

    return reply.status(200).send({
      success: true,
      message: "notifications read successfully",
      data: notifications,
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await notificationService.delete(
      request.params as VNotification.notificationId,
      request.user as VAuth.userId,
    );

    return reply.status(200).send({
      success: true,
      message: "notification deleted successfully",
      ...result,
    });
  },
};
