import { db } from "../database";
import ConversationRepo from "../repositories/Conversation.repo";
import ConversationMemberRepo from "../repositories/ConversationMember.repo";
import { VAuth } from "../validators/auth.validator";
import { VConversation } from "../validators/conversation.validator";

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
        const conversations = await ConversationRepo.query({ userId: user.userId, ...query })
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