import { FastifyInstance } from "fastify";
import { conversationController } from "../controller/conversation.controller";
import { authenticate } from "../hooks/authentication.hook";
import { conversationValidator } from "../validators/conversation.validator";

export const conversationRouter = (app: FastifyInstance) => {
    app.addHook("preHandler", authenticate.user)
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["conversations"] }
    })
    app.post("/", { schema: { body: conversationValidator.create } }, conversationController.create)
    app.get("/", { schema: { querystring: conversationValidator.query } }, conversationController.query)
    app.get("/:conversationId", { schema: { params: conversationValidator.conversationId, querystring: conversationValidator.membersAndmessages } }, conversationController.getById)
    app.patch("/:conversationId", { schema: { params: conversationValidator.conversationId, body: conversationValidator.update } }, conversationController.update)
}