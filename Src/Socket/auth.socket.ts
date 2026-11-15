import { Socket } from "socket.io";
import { AuthenticatedSocket, IJWTPayload } from "./types.socket";
import { FastifyInstance } from "fastify";
import UserRepo from "../Modules/User/User.repo";

export const SocketAuth = (server: FastifyInstance) => {
    return async (socket: Socket, next: (err?: Error) => void) => {
        try {
            const token = socket.handshake.auth?.token
            if (!token) return next(new Error("Authentication required"))
            const decoded = server.jwt.verify<IJWTPayload>(token)
            if (decoded.type != "access") return next(new Error("Invalid token"));
            const foundUser = await UserRepo.findById({ userId: decoded.userId })
            if (!foundUser) return next(new Error("User Not Found"));
            (socket as AuthenticatedSocket).user = { userId: foundUser.id, email: foundUser.email, name: foundUser.fullName }
            next()
        } catch (error) {
            next(new Error("Invalid or expired token"))
        }
    }
}