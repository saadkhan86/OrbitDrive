import { getTableColumns } from "drizzle-orm";
import { notifications } from "../../Database/schemas/notification.Schema";

const { organizationId, ...notificationRefColumns } = getTableColumns(notifications)
export default notificationRefColumns