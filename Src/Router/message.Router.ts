import { FastifyInstance } from "fastify"
import { authenticate } from "../Hooks/AuthenticationHook"
import { messageController } from "../Controller/message.Controller"
import { conversationValidator } from "../Validators/conversation.Validator"
import { messageValidator } from "../Validators/chat.Validator"

export const messageRouter = (app: FastifyInstance) => {
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["Chat"] }
    })
    app.addHook("preHandler", authenticate.user)
    app.post("/", { schema: { params: conversationValidator.conversationId, body: messageValidator.Messagecontent } }, messageController.create)
    app.get("/", messageController.query)
    app.patch("/", messageController.update)
}