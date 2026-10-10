import type { FastifyReply, FastifyRequest } from "fastify";

import { activityService } from "../Services/activity.Service";
import { VActivity } from "../Validators/activity.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const activityController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const activity = await activityService.create(
      request.params as VActivity.organizationId,
      request.body as VActivity.create,
      request.user as VAuth.userId,
    );

    return reply.code(201).send({
      success: true,
      message: "Activity created successfully",
      data: { activity },
    });
  },
  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const activities = await activityService.findAll(
      request.params as VActivity.organizationId,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity fetched successfully",
      data: { activities },
    });
  },

  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const activity = await activityService.findById(
      request.params as VActivity.activityId,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity fetched successfully",
      data: { activity },
    });
  },

  findByClient: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, clientId } = request.params as {
      organizationId: string;
      clientId: string;
    };

    const activities = await activityService.findByClient(
      clientId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity fetched successfully",
      data: { activities },
    });
  },

  findByDeal: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, dealId } = request.params as {
      organizationId: string;
      dealId: string;
    };

    const activities = await activityService.findByDeal(dealId, organizationId);

    return reply.code(200).send({
      success: true,
      message: "Activity fetched successfully",
      data: { activities },
    });
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const activity = await activityService.update(
      request.params as VActivity.activityId,
      request.body as VActivity.update,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity updated successfully",
      data: { activity },
    });
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await activityService.delete(
      request.params as VActivity.activityId,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity deleted successfully",
    });
  },
};
