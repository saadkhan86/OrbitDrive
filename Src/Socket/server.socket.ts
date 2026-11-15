import { Server as HttpServer } from "http"
import { Server } from "socket.io"
import { SocketAuth } from "./auth.socket"
import { FastifyInstance } from "fastify"
import { RegisterSocketEvents } from "./events.socket"
let io: Server
export const SocketServer = (server: FastifyInstance) => {
    io = new Server((server).server as HttpServer, {
        cors: {
            origin: ["*"],
            methods: ["POST", "GET"],
            credentials: true
        }
    })
    io.use(SocketAuth(server))
    RegisterSocketEvents(io)
    return io
}
export const getIo = (): Server => {
    if (!io) {
        throw new Error("Socket io not initialized")
    }
    return io
}