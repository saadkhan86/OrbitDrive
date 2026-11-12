import { Server, Socket } from "socket.io";

export const ChatSocket = (io: Server, socket: Socket) => {
    const userId = socket.data.userId
    socket.on("conversation:join", async ({ conversationId }) => {
        const room = `conversation:${conversationId}`
        await socket.join(room)
        socket.emit("converdation:joined", { conversationId })
    })
    socket.on("conversation:leave", async({ conversationId }) => {
        await socket.leave(`conversation:${conversationId}`)
    })
}