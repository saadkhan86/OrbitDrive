import { Server } from "socket.io";
import { AuthenticatedSocket, CallBack, CreateMessage } from "./types.socket";
import { SocketCallback, SocketResponse, response } from "./response.socket";
import ConversationRepo from "../Modules/Conversation/Conversation.repo";
import MessageRepo from "../Modules/Message/Message.repo";
import { db } from "../Database";

export const RegisterSocketEvents = (io: Server) => {
    io.on("connection", (socket) => {
        const userSocket = socket as AuthenticatedSocket;
        socket.join(userSocket.user.userId)
        console.log(`User connected ${userSocket.user.userId}`)
        socket
            .to(userSocket.user.userId)
            .emit("room_joined", {
                success: true,
                message: `welcome back ${userSocket.user.fullName}`,
                user: userSocket.user
            })
        socket
            .on("send_message", async (data: CreateMessage, callback: SocketCallback) => {
                let finalConversationId;
                let newMessage;
                if (data.conversationId) {
                    newMessage = await MessageRepo.create({
                        conversationId: data.conversationId,
                        content: data.content,
                        userId: userSocket.user.userId
                    })
                } else {
                    const conversationResult = db.transaction(async (tx) => {
                        const existing = await 
                    })
                }
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