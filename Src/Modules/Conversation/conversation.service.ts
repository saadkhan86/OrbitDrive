import { CustomError } from "../../ErrorHandler/CustomError"
import { IReply } from "../../Interfaces/IReply"
import { cusrorUtils } from "../../Utils/cursot.utils"
import { VAuth } from "../Auth/auth.validator"
import ConversationMemberRepo from "../ConversationMember/ConversationMember.repo"
import MessageRepo from "../Message/Message.repo"
import ConversationRepo from "./Conversation.repo"
import { VConversation } from "./conversation.validator"

export const conversationService = {
    query: async (user: VAuth.userId, query: VConversation.query): Promise<IReply.queryReturn> => {
        const decodedCursor = cusrorUtils.decode(query.cursor)
        const cursor = decodedCursor ? { id: decodedCursor.id, createdAt: new Date(decodedCursor.createdAt) } : null
        const conversations = await ConversationRepo.query({ ...user, ...query, cursor })
        const hasNextPage = conversations.length > query.limit
        const data = conversations.slice(0, query.limit)
        const lastConversation = data[data.length - 1]
        const nextCursor = hasNextPage && lastConversation ? cusrorUtils.encode({ id: lastConversation.id, createdAt: new Date(lastConversation.createdAt).toISOString() }) : null
        return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
    },
    getById: async (user: VAuth.userId, param: VConversation.conversationId, query: VConversation.conversationAndMessages) => {
        const conversation = await ConversationRepo.getById({ ...user, ...param, ...query })
        if (!conversation) throw new CustomError(404, "conversation not found", "NOT_FOUND")
        const latestMessages = await MessageRepo.query({ conversationId: conversation.id, limit: 1, cursor: null })
        const latestMembers = await ConversationMemberRepo.query({ conversationId: conversation.id, limit: 1, cursor: null })
        return { conversation, latestMessages, latestMembers }
    },
    update: async (user: VAuth.userId, conversation: VConversation.update & VConversation.conversationId) => {
        const updatedConversation = await ConversationRepo.update({ name: conversation.name, userId: user.userId, conversationId: conversation.conversationId })
        return updatedConversation
    }
}