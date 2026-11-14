import { FastifyInstance } from "fastify";
import { conversationMemberController } from "../controller/conversationMember.controller";
import { conversationValidator } from "../validators/conversation.validator";
import { conversationMemberValidator } from "../validators/conversationMember.validator";
import { authenticate } from "../hooks/authentication.hook";

export const conversationMemberRouter = async (app: FastifyInstance) => {
    app.addHook("preHandler", authenticate.user)
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["conversation Members"] }
    })
    app.get("/", { schema: { params: conversationValidator.conversationId, querystring: conversationMemberValidator.query } }, conversationMemberController.query)
    app.patch("/", { schema: { params: conversationValidator.conversationId, body: conversationMemberValidator.update } }, conversationMemberController.update)
}