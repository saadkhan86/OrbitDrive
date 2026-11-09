import { FastifyInstance } from "fastify";
import { conversationMemberController } from "../Controller/conversationMember.Controller";
import { conversationValidator } from "../Validators/conversation.Validator";
import { conversationMemberValidator } from "../Validators/conversationMember.Validator";

export const conversationMemberRouter = async (app: FastifyInstance) => {
    app.get("/", { schema: { params: conversationValidator.conversationId, querystring: conversationMemberValidator.query } }, conversationMemberController.query)
    app.patch("/", { schema: { params: conversationValidator.conversationId, body: conversationMemberValidator.update } }, conversationMemberController.update)
}