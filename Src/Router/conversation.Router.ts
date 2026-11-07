import { FastifyInstance } from "fastify";
import { conversationController } from "../Controller/conversation.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { conversationValidator } from "../Validators/conversation.Validator";

export const conversationRouter = (app: FastifyInstance) => {
    app.addHook("preHandler", authenticate.user)
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["conversations"] }
    })
    app.post("/", { schema: { body: conversationValidator.create } }, conversationController.create)
    app.get("/", { schema: { querystring: conversationValidator.query } }, conversationController.query)
    app.post("/:conversationId", { schema: { params: conversationValidator.conversationId } }, conversationController.create)
    app.get("/:conversationId", { schema: { params: conversationValidator.conversationId, querystring: conversationValidator.membersAndmessages } }, conversationController.update)
}