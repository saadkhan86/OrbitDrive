import { Server } from "socket.io";
import { AuthenticatedSocket, CallBack, CreateMessage } from "./types.socket";
import { SocketCallback, SocketResponse, response } from "./response.socket";
import ConversationRepo from "../Modules/Conversation/Conversation.repo";
import MessageRepo from "../Modules/Message/Message.repo";

export const RegisterSocketEvents = (io: Server) => {
    io.on("connection", (socket) => {
        const userSocket = socket as AuthenticatedSocket;
        console.log(`User connected ${userSocket.user.userId}`)
        socket.on("join_conversation", async (data: { conversationId: string }, callback: SocketCallback) => {
            const conversation = await ConversationRepo.getById({ userId: userSocket.user.userId, conversationId: data.conversationId })
            if (!conversation) return callback(response({ success: false, message: "conversation not found" }))
            socket.join(data.conversationId)
            callback(response({
                success: true,
                message: "conversation joined",
                data: { user: userSocket.user, conversation }
            }))
        })
        socket.on("send_message", async (data: CreateMessage, callback: SocketCallback) => {
            const message = await MessageRepo.create({
                conversationId: data.conversationId,
                content: data.content,
                userId: userSocket.user.userId
            })
            socket.to(data.conversationId)
                .emit("receive_message",
                    response({ success: true, message: "message received", data: { user: userSocket.user, message: message as any } })
                )
            callback(response({
                success: true,
                message: "new message received",
                data: { user: userSocket.user, message: message as any }
            }))
        })
        socket.on("leave_conversation", (conversationId: string) => {
            socket.leave(conversationId)
        })
        socket.on("disconnect", () => {
            console.log(`User disconnected ${userSocket.user.userId}`)
        })
    })
}