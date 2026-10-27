import type { FastifyReply, FastifyRequest } from "fastify";
import { notificationService } from "../Services/notification.Service";
import { VNotification } from "../Validators/notification.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const notificationController = {
  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const notifications = await notificationService.findAll(
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
    const notifications = await notificationService.markAsRead(
      request.user as VAuth.userId,
      request.body as VNotification.notificationArray,
    );

    return reply.status(200).send({
      success: true,
      message: "notifications read successfully",
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await notificationService.delete(
      request.body as VNotification.notificationArray,
      request.user as VAuth.userId,
    );

    return reply.status(200).send({
      success: true,
      message: "notification deleted successfully",
    });
  },
};
