import { getTableColumns } from "drizzle-orm";
import { activities } from "../../Database/schemas/activity.Schema";

const { clientId, userId, dealId, ...activityRefColumns } = getTableColumns(activities)
export default activityRefColumns