import { getTableColumns } from "drizzle-orm";
import { conversations } from "../../Database/schemas/conversations.Schema";

const { createdBy, ...conversationRefColumns } = getTableColumns(conversations)
export default conversationRefColumns