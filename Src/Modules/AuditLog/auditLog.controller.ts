import type { FastifyReply, FastifyRequest } from "fastify";
import { auditLogService } from "./auditLog.service";
import { VAuditLog } from "./auditLog.validator";
import { IReply } from "../../Interfaces/IReply";

export const auditLogController = {
  query: async (request: FastifyRequest, reply: FastifyReply) => {
    const auditLogs:IReply.queryReturn = await auditLogService.query(
      request.params as VAuditLog.organizationId,
      request.query as VAuditLog.query
    );

    return reply.status(200).send({
      success: true,
      message: "Audit Logs fetched successfully",
      data: { result: auditLogs }
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
