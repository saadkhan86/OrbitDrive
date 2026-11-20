import { CreateMessage } from "./types.socket";
import { VAuth } from "../Modules/Auth/auth.validator";
import MessageRepo from "../Modules/Message/Message.repo";
import ConversationMemberRepo from "../Modules/ConversationMember/ConversationMember.repo";
import ConversationRepo from "../Modules/Conversation/Conversation.repo";
import { messages } from "../Database/schemas/messages.Schema";

class SocketRepo {
    private async createConversation(userId: string) {
        return await ConversationRepo.create({ userId })
    }
    private async createMembers(conversationId: string, members: string[]) {
        const membersWithConv: { conversationId: string, userId: string }[] = members.map((member) => ({ conversationId, userId: member }))
        return await ConversationMemberRepo.create(membersWithConv)
    }
    private async findConversation(members: string[]) {
        return await ConversationMemberRepo.findExisting({ members })
    }
    private async createMessage(userId: string, conversationId: string, content: any) {
        return MessageRepo.create({
            conversationId,
            content,
            userId
        })
    }
    public async create(user: VAuth.userId, data: CreateMessage) {
        let message: typeof messages.$inferSelect | undefined;
        console.log(data)
        if (data.conversationId) {
            message = await this
                .createMessage(
                    user.userId,
                    data.conversationId,
                    data.content
                )
        }
        const existingConversation = await this
            .findConversation([user.userId, data.receiverId])
        if (existingConversation && existingConversation.length == 2) {
            message = await this
                .createMessage(
                    user.userId,
                    existingConversation[0]?.conversationId!,
                    data.content
                )
        }
        const createdConversation = await this
            .createConversation(user.userId)
        const createdMembers = await this
            .createMembers(createdConversation?.id!, [user.userId, data.receiverId])
        message = await this
            .createMessage(
                user.userId,
                createdMembers?.conversationId!,
                data.content
            )
        return message
    }

}
export default new SocketRepo()