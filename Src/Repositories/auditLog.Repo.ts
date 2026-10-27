import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
import { audit_logs } from "../Database/Schemas/audit_log.Schema";
import { db } from "../Database";
import { VAuditLog } from "../Validators/auditLog.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "../Database/Schemas/users.Schema";

class AuditLogRepo {
  //issue resolved
  //if we keeps tx as a first parameter then we must have to pass it in every call
  //i have changed the signature of the create method
  public async create(
    tx: NodePgDatabase,
    data: typeof audit_logs.$inferInsert,
  ) {
    return (await tx.insert(audit_logs).values(data).returning())[0];
  }

  public async query(data: VAuditLog.organizationId & VAuditLog.query) {
    const { page, limit } = data
    const _query: any[] = [eq(audit_logs.organizationId, data.organizationId)];
    if (data.action) {
      _query.push(eq(audit_logs.action, data.action));
    }
    if (data.entityType) {
      _query.push(eq(audit_logs.entityType, data.entityType));
    }
    const [foundAuditLogs, total] = await Promise.all([
      db
        .select()
        .from(audit_logs)
        .where(and(..._query))
        .orderBy(desc(audit_logs.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: count() })
        .from(audit_logs)
        .where(and(..._query))
    ])
    return { auditLogs: foundAuditLogs, count: total[0]?.count ?? 0 }
  }

  public async findById(data: VAuditLog.auditLogId) {
    const auditLog = (
      await db
        .select({
          ...getTableColumns(audit_logs),
          user: { name: users.fullName },
        })
        .from(audit_logs)
        .innerJoin(users, eq(users.id, audit_logs.userId))
        .where(
          and(
            eq(audit_logs.id, data.auditLogId),
            eq(audit_logs.organizationId, data.organizationId),
          ),
        )
        .limit(1)
    )[0] ?? null
    return auditLog
  }
}

export default new AuditLogRepo();
