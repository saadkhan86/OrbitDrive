import type { FastifyReply, FastifyRequest } from "fastify";

import { activityService } from "../Services/activity.Service";

export const activityController = {
  // Create activity
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const activity = await activityService.create(
      organizationId,
      request.body as any,
      request.user.id,
    );

    return reply.code(201).send({
      success: true,
      data: activity,
    });
  },

  // Get all activities
  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId } = request.params as {
      organizationId: string;
    };

    const activities = await activityService.findAll(organizationId);

    return reply.code(200).send({
      success: true,
      data: activities,
    });
  },

  // Get activity by ID
  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, activityId } = request.params as {
      organizationId: string;
      activityId: string;
    };

    const activity = await activityService.findById(
      activityId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: activity,
    });
  },

  // Get activities by client
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
      data: activities,
    });
  },

  // Get activities by deal
  findByDeal: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, dealId } = request.params as {
      organizationId: string;
      dealId: string;
    };

    const activities = await activityService.findByDeal(
      dealId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: activities,
    });
  },

  // Update activity
  update: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, activityId } = request.params as {
      organizationId: string;
      activityId: string;
    };

    const activity = await activityService.update(
      activityId,
      organizationId,
      request.body as any,
    );

    return reply.code(200).send({
      success: true,
      data: activity,
    });
  },

  // Delete activity
  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    const { organizationId, activityId } = request.params as {
      organizationId: string;
      activityId: string;
    };

    const result = await activityService.delete(
      activityId,
      organizationId,
    );

    return reply.code(200).send({
      success: true,
      data: result,
    });
  },
};
