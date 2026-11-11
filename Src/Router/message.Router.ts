import { FastifyInstance } from "fastify"
import { authenticate } from "../Hooks/AuthenticationHook"
import { messageController } from "../Controller/message.Controller"
import { messageValidator } from "../Validators/chat.Validator"
import { conversationValidator } from "../Validators/conversation.Validator"
export const messageRouter = (app: FastifyInstance) => {
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["Chat"] }
    })
    app.addHook("preHandler", authenticate.user)
    app.get("/", { schema: { params: conversationValidator.conversationId, querystring: messageValidator.query } }, messageController.query)
}