import { FastifyInstance } from "fastify"
import { authenticate } from "../../Hooks/authentication.hook"
import { conversationValidator } from "../Conversation/conversation.validator"
import { messageValidator } from "./message.validator"
import { messageController } from "./message.controller"
export const messageRouter = (app: FastifyInstance) => {
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["Chat"] }
    })
    app.addHook("preHandler", authenticate.user)
    app.get("/", { schema: { params: conversationValidator.conversationId, querystring: messageValidator.query } }, messageController.query)
}