import { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { conversationMemberValidator } from "./conversationMember.validator";
import { conversationMemberController } from "./conversationMember.controller";

export const conversationMemberRouter = async (app: FastifyInstance) => {
    app.addHook("preHandler", authenticate.user)
    app.addHook("onRoute", (route) => {
        route.schema = { ...route.schema, tags: ["conversation Members"] }
    })
    app.get("/", { schema: { params: conversationMemberValidator.conversationId, querystring: conversationMemberValidator.query } }, conversationMemberController.query)
    app.patch("/", { schema: { params: conversationMemberValidator.conversationId, body: conversationMemberValidator.update } }, conversationMemberController.update)
}