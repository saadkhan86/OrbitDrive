import { db } from "../Database";
import { CustomError } from "../Errors/CustomError";
import ConversationRepo from "../Repositories/Conversation.Repo";
import ConversationMemberRepo from "../Repositories/ConversationMember.Repo";
import { VAuth } from "../Validators/auth.Validator";
import { VConversation } from "../Validators/conversation.Validator";

export const conversationService = {
    create: async (user: VAuth.userId, data: VConversation.Create) => {
        const conversation = await db.transaction(async (tx) => {
            const createdConversation: NonNullable<any> = await ConversationRepo.create(tx, { ...data, userId: user.userId })
            const allParticipants = [user.userId, ...data.participants]
            const participantsArray: { conversationId: string, userId: string }[] = allParticipants.map((userId) => ({ conversationId: createdConversation.id, userId: userId }))
            const createdConversationMembers = await ConversationMemberRepo.create(tx, participantsArray)
            return createdConversationMembers
        })
        return conversation
    },
    query: async (user: VAuth.userId, query: VConversation.Query) => {
        const conversations = await ConversationRepo.query({ userId: user.userId, ...query })
        return conversations
    }, getById: async (user: VAuth.userId, conversation: VConversation.ConversationId) => {
        const foundConversation = await ConversationRepo.getById({ userId: user.userId, conversationId: conversation.conversationId })
        if (!foundConversation) throw new CustomError(404, "conversation not found", "NOT_FOUND")
        const members = await ConversationMemberRepo.getById({ userId: user.userId, conversationId: foundConversation.id })
        return foundConversation
    }
}