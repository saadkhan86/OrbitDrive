import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { messages } from "../Database/Schemas/messages.Schema";
import { VAuth } from "../Validators/auth.Validator";
import { VMessageValidator } from "../Validators/chat.Validator";
import { VConversation } from "../Validators/conversation.Validator";

class messageRepo {
    public async query(data: VConversation.conversationId & VMessageValidator.query) {

    }
}
export default new messageRepo()