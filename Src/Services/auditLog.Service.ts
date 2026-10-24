import { CustomError } from "../Errors/CustomError";
import auditLogRepo from "../Repositories/auditLog.Repo";
import { VAuditLog } from "../Validators/auditLog.Validator";

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
