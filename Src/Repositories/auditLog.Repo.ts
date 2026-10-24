import { and, count, desc, eq } from "drizzle-orm";
import { auditLogs } from "../Database/Schemas/audit_log.Schema";
import { db } from "../Database";
import { VAuditLog } from "../Validators/auditLog.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class AuditLogRepo {
  //issue resolved
  //if we keeps tx as a first parameter then we must have to pass it in every call
  //i have changed the signature of the create method
  public async create(
    tx: NodePgDatabase,
    data: typeof auditLogs.$inferInsert,
  ) {
    return (await tx.insert(auditLogs).values(data).returning())[0];
  }

  public async query(data: VAuditLog.organizationId & VAuditLog.query) {
    const { page, limit } = data
    const _query: any[] = [eq(auditLogs.organizationId, data.organizationId)];
    if (data.action) {
      _query.push(eq(auditLogs.action, data.action));
    }
    if (data.entityType) {
      _query.push(eq(auditLogs.entityType, data.entityType));
    }
    const [foundAuditLogs, total] = await Promise.all([
      db
        .select()
        .from(auditLogs)
        .where(and(..._query))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: count() })
        .from(auditLogs)
        .where(and(..._query))
    ])
    return { auditLogs: foundAuditLogs, count: total[0]?.count ?? 0 }
  }

  public async findById(data: VAuditLog.auditLogId) {
    return (
      (
        await db
          .select()
          .from(auditLogs)
          .where(
            and(
              eq(auditLogs.id, data.auditLogId),
              eq(auditLogs.organizationId, data.organizationId),
            ),
          )
          .limit(1)
      )[0] ?? null
    );
  }
}

export default new AuditLogRepo();
