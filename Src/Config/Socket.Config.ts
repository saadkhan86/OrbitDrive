import { Server } from "socket.io";
import { Server as HttpServer } from "http";
let io: Server
export const initializeSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["POST", "GET"]
        }
    })
    io.on("connection", (socket) => {
        console.log(`Socket connected ${socket.id}`)
        socket.on("disconnected", (reason) => {
            console.log(`Socket disconnected ${reason} | ${socket.id}`)
        })
    })
    return io
}
export const getIo = () => {
    if (!io)
        throw new Error("Socket io not initialized yet")
    return io
}