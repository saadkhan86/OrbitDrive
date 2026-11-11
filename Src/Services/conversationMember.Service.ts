import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import ConversationRepo from "../Repositories/Conversation.Repo";
import ConversationMemberRepo from "../Repositories/ConversationMember.Repo";
import { VAuth } from "../Validators/auth.Validator";
import { VConversation } from "../Validators/conversation.Validator";
import { VConversationMember } from "../Validators/conversationMember.Validator";

export const conversationMemberService = {
    query: async (conversation: VConversation.conversationId, query: VConversationMember.query) => {
        const members = await ConversationMemberRepo.query({ ...conversation, ...query })
        return members
    },
    update: async (user: VAuth.userId, conversation: VConversation.conversationId, members: VConversationMember.update) => {
        const isExist = await ConversationRepo.getById({ ...user, ...conversation })
        if (!isExist) throw new CustomError(404, "conversation not found", "NOT_FOUND")
        if (isExist.createdBy != user.userId) throw new CustomError(400, "you are not owner of this conversation", "ACCESS_DENIED")
        if (isExist.type == "direct") throw new CustomError(400, "this action can be performed on direct conversation", "ACCESS_DENIED")
        if (members.action == "add") {
            const arrayMembers: { userId: string, conversationId: string }[] = members.participants.map((participant) => ({ userId: participant, conversationId: conversation.conversationId }))
            const createdMembers = await db.transaction(async (tx) => {
                return await ConversationMemberRepo.create(tx, { ...arrayMembers })
            })
            return createdMembers
        } else if (members.action == "remove") {
            return await ConversationMemberRepo.remove({ ...members })
        } else {
            return {}
        }
    }
}