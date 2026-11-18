import { getTableColumns } from "drizzle-orm";
import { organizations } from "../../Database/schemas/organization.Schema";

const { updatedAt, slug, ownerId, ...organizationRefColumns } = getTableColumns(organizations)
export default organizationRefColumns