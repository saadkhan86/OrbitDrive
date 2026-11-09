import { FastifyReply, FastifyRequest } from "fastify";
import { messageService } from "../Services/message.Service";
import { VConversation } from "../Validators/conversation.Validator";
import { VMessageValidator } from "../Validators/chat.Validator";

export const messageController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await messageService.create(request.params as VConversation.ConversationId, request.body as VMessageValidator.MessageContent)
        reply.status(201).send({ success: true, message: "message created successfully", data: { chat } })
    },
    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await messageService.update()
        reply.status(200).send({ success: true, message: "chat created successfully", data: { chat } })

    },
    query: async (request: FastifyRequest, reply: FastifyReply) => {
        const chat = await messageService.query()
        reply.status(200).send({ success: true, message: "chat created successfully", data: { chat } })

    }
}