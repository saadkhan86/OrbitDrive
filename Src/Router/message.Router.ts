import { FastifyInstance } from "fastify"
import { authenticate } from "../Hooks/AuthenticationHook"
import { chatController } from "../Controller/chat.Controller"

export const messageRouter = (app: FastifyInstance) => {
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["Chat"] }
    })
    app.addHook("preHandler", authenticate.user)
    app.post("/:conversationId", chatController.create)
    app.get("/", chatController.query)
    app.patch("/", chatController.update)
}