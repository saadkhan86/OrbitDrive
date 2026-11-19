import { NodePgDatabase } from "drizzle-orm/node-postgres";
import ConversationRepo from "../Modules/Conversation/Conversation.repo";
import { CreateMessage } from "./types.socket";

const messagingSocketService = {
    createPrivateConversation: async (tx: NodePgDatabase, data: CreateMessage & { userId: string }) => {
        const conversation = await ConversationRepo.create(tx, {
            userId: data.userId,
            type:
        })
    }
}