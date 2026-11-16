import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
import { audit_logs } from "../../Database/schemas/audit_log.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VAuditLog } from "./auditLog.validator";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { organizations } from "../../Database/schemas/organization.Schema";

class AuditLogRepo {
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
    const { userId, organizationId, entityId, ...audiLogColumns } = getTableColumns(audit_logs)
    const auditLog = (
      await db
        .select({
          ...audiLogColumns,
          organization: { ...getTableColumns(organizations) },
          user: { id: users.id, name: users.fullName, profile: users.profile },
        })
        .from(audit_logs)
        .innerJoin(users, eq(users.id, audit_logs.userId))
        .innerJoin(organizations, eq(organizations.id, audit_logs.organizationId))
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
