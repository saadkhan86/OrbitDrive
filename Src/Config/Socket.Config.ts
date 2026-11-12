import { Server } from "socket.io";
import { Server as HttpServer } from "http"
import { FastifyInstance } from "fastify";
import { decode } from "punycode";

interface IJWTPayload {
    userId: string,
    type: "access" | "refresh" | "password-reset"
}
let io: Server;
export const initializeSocket = (httpServer: HttpServer, server: FastifyInstance) => {
    io = new Server(httpServer, {
        cors: {
            origin: ["*"],
            methods: ["POST", "GET"]
        }
    })
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token
            if (!token) return next(new Error("Unauthorized"))
            const decoded = server.jwt.verify<IJWTPayload>(token)
            if (decoded.type !== "access") return next(new Error("Invalid token type"))
            socket.data.userId = decoded.userId
            next()
        } catch (error) {
            next(new Error("Unauthorized"))
        }
    })
    io.on("connection", (socket) => {
        const userId = socket.data.userId as string
        console.log(`Socket connected : user --> ${userId}`)
        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected : ${reason} | ${socket.id}`)
        })
    })
    return io
}
export const getIo = () => {
    if (!io) {
        throw new Error("Socket not initialized yet")
    }
    return io
}