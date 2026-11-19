import { getTableColumns } from "drizzle-orm";
import { tasks } from "../../Database/schemas/tasks.Schema";

const { clientId, dealId, assignedTo, ...taskRefColumns } = getTableColumns(tasks)
export default taskRefColumns