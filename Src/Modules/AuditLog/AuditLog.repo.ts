import { and, count, desc, eq, getTableColumns, lt, or, SQL } from "drizzle-orm";
import { audit_logs } from "../../Database/schemas/audit_log.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VAuditLog } from "./auditLog.validator";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { organizations } from "../../Database/schemas/organization.Schema";
import { ICursor } from "../../Interfaces/ICursor";
import auditLogRefColumns from "./audit.refrence";
import organizationRefColumns from "../Organization/organization.refrence";
import userRefColumns from "../User/user.reference";

class AuditLogRepo {
  public async create(
    tx: NodePgDatabase,
    data: typeof audit_logs.$inferInsert,
  ) {
    return (await tx.insert(audit_logs).values(data).returning())[0];
  }
  public async query(data: VAuditLog.organizationId & Omit<VAuditLog.query, "cursor"> & ICursor.query) {
    const _query: SQL[] = [eq(audit_logs.organizationId, data.organizationId)];
    if (data.cursor) {
      _query.push(
        or(
          lt(audit_logs.createdAt, data.cursor.createdAt),
          and(
            eq(audit_logs.createdAt, data.cursor.createdAt),
            lt(audit_logs.id, data.cursor.id)
          )
        )! as SQL
      )
    }
    if (data.action) {
      _query.push(eq(audit_logs.action, data.action));
    }
    if (data.entityType) {
      _query.push(eq(audit_logs.entityType, data.entityType));
    }
    return await db
      .select()
      .from(audit_logs)
      .where(and(..._query))
      .orderBy(
        desc(
          audit_logs.createdAt
        ),
        desc(audit_logs.id)
      )
      .limit(data.limit + 1)
  }
  public async findById(data: VAuditLog.auditLogId) {
    return (
      await db
        .select({
          ...auditLogRefColumns,
          organization: { ...organizationRefColumns },
          user: { ...userRefColumns },
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
    )[0]
  }
}

export default new AuditLogRepo();
