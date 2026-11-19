import { getTableColumns } from "drizzle-orm";
import { organization_members } from "../../Database/schemas/organization_members.Schema";

const { userId, ...organizationMemberRefColumns } = getTableColumns(organization_members)
export default organizationMemberRefColumns