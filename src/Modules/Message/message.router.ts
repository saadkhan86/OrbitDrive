import { FastifyInstance } from "fastify"
import { authenticate } from "../hooks/authentication.hook"
import { messageController } from "../controller/message.controller"
import { messageValidator } from "../validators/chat.validator"
import { conversationValidator } from "../validators/conversation.validator"
export const messageRouter = (app: FastifyInstance) => {
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["Chat"] }
    })
    app.addHook("preHandler", authenticate.user)
    app.get("/", { schema: { params: conversationValidator.conversationId, querystring: messageValidator.query } }, messageController.query)
}