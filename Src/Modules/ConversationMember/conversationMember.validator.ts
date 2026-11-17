import z, { decodeAsync } from "zod";

export const conversationMemberValidator = {
    conversationId: z.object({
        conversationId: z.uuid({ message: "Invalid conversationId" })
    }),
    query: z.object({
        cursor: z.coerce.string().optional(),
        limit: z.coerce.number().optional().default(30)
    }),
    update: z.object({
        action: z.enum(["add", "remove"], { message: "you can only add or remove members" }),
        participants: z.array(z.uuid({ message: "invalid participant id" }).min(1, { message: "atleast one participant is required for this action" }))
    })
}
export declare namespace VConversationMember {
    type update = z.infer<typeof conversationMemberValidator.update>
    type query = z.infer<typeof conversationMemberValidator.query>
    type conversationId = z.infer<typeof conversationMemberValidator.conversationId>
}