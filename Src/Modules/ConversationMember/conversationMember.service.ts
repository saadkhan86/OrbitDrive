import { db } from "../../Database"
import { CustomError } from "../../ErrorHandler/CustomError"
import { cusrorUtils } from "../../Utils/cursot.utils"
import { VAuth } from "../Auth/auth.validator"
import ConversationRepo from "../Conversation/Conversation.repo"
import { VConversation } from "../Conversation/conversation.validator"
import ConversationMemberRepo from "./ConversationMember.repo"
import { VConversationMember } from "./conversationMember.validator"

export const conversationMemberService = {
    query: async (conversation: VConversation.conversationId, query: VConversationMember.query) => {
        const decodedCursor = cusrorUtils.decode(query.cursor)
        const cursor = decodedCursor ? { id: decodedCursor.id, createdAt: new Date(decodedCursor.createdAt) } : null
        const members = await ConversationMemberRepo.query({ ...conversation, ...query, cursor })
        const hasNextPage = members.length > query.limit
        const data = members.slice(0, query.limit)
        const lastMember = data[data.length - 1]
        const nextCursor = hasNextPage && lastMember ? cusrorUtils.encode({ id: lastMember.id, createdAt: new Date(lastMember.joinedAt!).toISOString() }) : null;
        return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
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