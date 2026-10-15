import { and, desc, eq } from "drizzle-orm";
import { auditLogs } from "../Database/Schemas/audit_log.Schema";
import { db } from "../Database";
import { VAuditLog } from "../Validators/auditLog.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class AuditLogRepo {
  //issue resolved
  //if we keeps tx as a first parameter then we must have to pass it in every call
  //i have changed the signature of the create method
  public async create(
    data: typeof auditLogs.$inferInsert,
    tx: NodePgDatabase = db,
  ) {
    return (await tx.insert(auditLogs).values(data).returning())[0];
  }

  public async findAll(data: VAuditLog.organizationId) {
    return await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.organizationId, data.organizationId))
      .orderBy(desc(auditLogs.createdAt));
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
