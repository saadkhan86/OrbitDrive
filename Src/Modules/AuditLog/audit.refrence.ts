import { getTableColumns } from "drizzle-orm";
import { audit_logs } from "../../Database/schemas/audit_log.Schema";

const { userId, organizationId, entityId, ...auditLogRefColumns } = getTableColumns(audit_logs)
export default auditLogRefColumns