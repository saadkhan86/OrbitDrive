import { decode } from "punycode";
import { CustomError } from "../../ErrorHandler/CustomError";
import { cusrorUtils } from "../../Utils/cursot.utils";
import AuditLogRepo from "./AuditLog.repo";
import { VAuditLog } from "./auditLog.validator";
import { IReply } from "../../Interfaces/IReply";

export const auditLogService = {
  query: async (param: VAuditLog.organizationId, query: VAuditLog.query): Promise<IReply.queryReturn> => {
    const decodedCursor = cusrorUtils.decode(query.cursor)
    const cursor = decodedCursor ? { id: decodedCursor.id, createdAt: new Date(decodedCursor.createdAt) } : null
    const auditLogs = await AuditLogRepo.query({ ...param, ...query, cursor })
    const hasNextPage = auditLogs.length > query.limit
    const data = auditLogs.slice(0, query.limit)
    const lastLog = data[data.length - 1]
    const nextCursor = hasNextPage && lastLog ? cusrorUtils.encode({ id: lastLog.id, createdAt: new Date(lastLog.createdAt).toISOString() }) : null
    return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
  },
  findById: async (param: VAuditLog.auditLogId) => {
    const auditLog = await AuditLogRepo.findById(param);

    if (!auditLog) {
      throw new CustomError(404, "Audit log not found", "AUDIT_LOG_NOT_FOUND");
    }

    return auditLog;
  },
};
