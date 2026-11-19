import { Server, Socket } from "socket.io";

export interface SocketUser {
    userId: string
    email: string
    fullName: string
}
export interface IJWTPayload {
    userId: string,
    type: "access" | "refresh"
}
export interface AuthenticatedSocket extends Socket {
    user: SocketUser
}
export interface CreateMessage {
    conversationId: string | null
    receiverId: string
    content: any
}
export interface CallBack {
    success: false
    message: string
}

export interface SocketServer extends Server { }
