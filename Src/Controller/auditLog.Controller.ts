import type { FastifyReply, FastifyRequest } from "fastify";

import { auditLogService } from "../Services/auditLog.Service";
import { VActivity } from "../Validators/activity.Validator";
import { VAuditLog } from "../Validators/auditLog.Validator";

export const auditLogController = {
  findAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const auditLogs = await auditLogService.findAll(
      request.params as VAuditLog.organizationId,
    );

    return reply.status(200).send({
      success: true,
      message: "Audit Logs fetched successfully",
      data: auditLogs,
    });
  },

  findById: async (request: FastifyRequest, reply: FastifyReply) => {
    const auditLog = await auditLogService.findById(
      request.params as VAuditLog.auditLogId,
    );

    return reply.status(200).send({
      success: true,
      message: "Audit log fetched successfully",
      data: auditLog,
    });
  },
};
