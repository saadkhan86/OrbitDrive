import { getTableColumns } from "drizzle-orm";
import { organization_invitations } from "../../Database/schemas/organization_invitation.Schema";

const { createdBy, ...organizationInvitationRefColumns } = getTableColumns(organization_invitations)
export default organizationInvitationRefColumns