import { FastifyReply, FastifyRequest } from "fastify";
import { chatService } from "../Services/message.Service";

export const chatController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await chatService.create()
        reply.status(201).send({ success: true, message: "chat created successfully", data: { chat } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await chatService.update()
        reply.status(200).send({ success: true, message: "chat created successfully", data: { chat } })

    },
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await chatService.query()
        reply.status(200).send({ success: true, message: "chat created successfully", data: { chat } })

    }
}