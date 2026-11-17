import { db } from "../../Database"
import { cusrorUtils } from "../../Utils/cursot.utils"
import { VAuth } from "../Auth/auth.validator"
import ConversationMemberRepo from "../ConversationMember/ConversationMember.repo"
import ConversationRepo from "./Conversation.repo"
import { VConversation } from "./conversation.validator"

export const conversationService = {
    create: async (user: VAuth.userId, conversation: VConversation.create) => {
        const conversationMember = await db.transaction(async (tx) => {
            const createdConversation: NonNullable<any> = await ConversationRepo.create(tx, { ...conversation, userId: user.userId })
            const allParticipants = [user.userId, ...conversation.participants]
            const participantsArray: { conversationId: string, userId: string }[] = allParticipants.map((participant) => ({ conversationId: createdConversation.id, userId: participant }))
            participantsArray.push({ userId: user.userId, conversationId: createdConversation.id })
            const createdConversationMembers = await ConversationMemberRepo.create(tx, participantsArray)
            return createdConversationMembers
        })
        return conversationMember
    },
    query: async (user: VAuth.userId, query: VConversation.query) => {
        const decodedCursor = cusrorUtils.decode(query.cursor)
        const cursor = decodedCursor ? { id: decodedCursor.id, createdAt: new Date(decodedCursor.createdAt) } : null
        const conversations = await ConversationRepo.query({ ...user, ...query, cursor })
        const hasNextPage = conversations.length > query.limit
        const data = conversations.slice(0, query.limit)
        const lastConversation = data[data.length - 1]
        const nextCursor = hasNextPage && lastConversation ? cusrorUtils.encode({ id: lastConversation.id, createdAt: new Date(lastConversation.createdAt).toISOString() }) : null
        return conversations
    },
    getById: async (user: VAuth.userId, conversation: VConversation.conversationId, ConversationAndMessages: VConversation.conversationAndMessages) => {
        const foundConversation = await ConversationRepo.getById({ ...user, ...conversation, ...ConversationAndMessages })
        return foundConversation
    },
    update: async (user: VAuth.userId, conversation: VConversation.update & VConversation.conversationId) => {
        const updatedConversation = await ConversationRepo.update({ name: conversation.name, userId: user.userId, conversationId: conversation.conversationId })
        return updatedConversation
    }
}