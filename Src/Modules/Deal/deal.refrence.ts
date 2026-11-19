import { getTableColumns } from "drizzle-orm";
import { deals } from "../../Database/schemas/deals.Schema";

const { clientId, ...dealRefColumns } = getTableColumns(deals)
export default dealRefColumns