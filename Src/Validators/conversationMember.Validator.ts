import z, { decodeAsync } from "zod";
import { conversationMemberController } from "../Controller/conversationMember.Controller";

export const conversationMemberValidator = {
    query: z.object({
        page: z.coerce.number().optional().default(1),
        limit: z.coerce.number().optional().default(30)
    }),
    update: z.object({
        action: z.enum(["add", "remove"], { message: "you can only add or remove members" }),
        participants: z.array(z.uuid({ message: "invalid participant id" }).min(1, { message: "atleast one participant is required for this action" }))
    })
}
export declare namespace VConversationMember {
    type Update = z.infer<typeof conversationMemberValidator.update>
    type query = z.infer<typeof conversationMemberValidator.query>
}