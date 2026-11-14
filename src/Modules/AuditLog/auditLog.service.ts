import { CustomError } from "../errorHandler/CustomError";
import auditLogRepo from "../repositories/AuditLog.repo";
import { VAuditLog } from "../validators/auditLog.validator";

export const auditLogService = {
  query: async (organization: VAuditLog.organizationId, query: VAuditLog.query) => {
    const auditLogs = auditLogRepo.query({ ...organization, ...query })
    return auditLogs
  },

  findById: async (data: VAuditLog.auditLogId) => {
    const auditLog = await auditLogRepo.findById(data);

    if (!auditLog) {
      throw new CustomError(404, "Audit log not found", "AUDIT_LOG_NOT_FOUND");
    }

    return auditLog;
  },
};
