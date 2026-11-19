import { getTableColumns } from "drizzle-orm";
import { clients } from "../../Database/schemas/clients.Schema";

const { ...clientRefColumns } = getTableColumns(clients)
export default clientRefColumns