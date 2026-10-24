import type { FastifyReply, FastifyRequest } from "fastify";

import { activityService } from "../Services/activity.Service";
import { VActivity } from "../Validators/activity.Validator";
import { VAuth } from "../Validators/auth.Validator";

export const activityController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const activity = await activityService.create(
      request.user as VAuth.userId,
      request.params as VActivity.organizationId,
      request.body as VActivity.create,
    );

    return reply.code(201).send({
      success: true,
      message: "Activity created successfully",
      data: { activity },
    });
  },
  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const activities = await activityService.query(
      request.params as VActivity.organizationId,
      request.query as VActivity.query
    );

    return reply.code(200).send({
      success: true,
      message: "Activity fetched successfully",
      data: { result: activities },
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
      request.user as VAuth.userId,
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
    await activityService.delete(
      request.user as VAuth.userId,
      request.params as VActivity.activityId,
    );

    return reply.code(200).send({
      success: true,
      message: "Activity deleted successfully",
    });
  },
};
