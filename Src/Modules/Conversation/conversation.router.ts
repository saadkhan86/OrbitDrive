import { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { conversationValidator } from "./conversation.validator";
import { conversationController } from "./conversation.controller";
export const conversationRouter = (app: FastifyInstance) => {
    app.addHook("preHandler", authenticate.user)
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["conversations"] }
    })
    app.get("/", {
        schema:
        {
            querystring: conversationValidator.query
        }
    }, conversationController.query)
    app.get("/:conversationId", {
        schema:
        {
            params: conversationValidator.conversationId,
            querystring: conversationValidator.membersAndmessages
        }
    }, conversationController.getById)
}