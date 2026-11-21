import { Server } from "socket.io";
import { AuthenticatedSocket, CreateMessage } from "./types.socket";
import { SocketCallback, response } from "./response.socket";
import SocketRepo from "./Socket.Repo";

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
                const message = await SocketRepo.create(userSocket.user, data)
                const conversationId = message?.conversationId!
                const receiverId = data.receiverId
                const receiverSockets = await io.in(receiverId).fetchSockets()
                const isReceiverInConversation = receiverSockets.some((receiverSocket) => receiverSocket.rooms.has(conversationId!))
                if (isReceiverInConversation) {
                    socket.to(conversationId).emit("receive_message", message)
                } else {
                    socket.to(data.receiverId).emit("receive_message", message)
                }
                callback(response({
                    success: true,
                    message: "message created",
                    data: { user: userSocket.user, message }
                }))
            })
        socket.on("leave", (conversationId: string) => {
            socket.leave(conversationId)
        })
        socket.on("disconnect", () => {
            console.log(`User disconnected ${userSocket.user.userId}`)
        })
    })
}