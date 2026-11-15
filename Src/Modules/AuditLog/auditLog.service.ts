import { CustomError } from "../../ErrorHandler/CustomError";
import AuditLogRepo from "./AuditLog.repo";
import { VAuditLog } from "./auditLog.validator";

export const auditLogService = {
  query: async (param: VAuditLog.organizationId, query: VAuditLog.query) => {
    const auditLogs = AuditLogRepo.query({ ...param, ...query })
    return auditLogs
  },

  findById: async (param: VAuditLog.auditLogId) => {
    const auditLog = await AuditLogRepo.findById(param);

    if (!auditLog) {
      throw new CustomError(404, "Audit log not found", "AUDIT_LOG_NOT_FOUND");
    }

    return auditLog;
  },
};
