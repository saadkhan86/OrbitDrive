import z from "zod";

export const conversationValidator = {
    query: z.object({
        search: z.coerce.string().optional(),
        cursor: z.coerce.string().optional(),
        limit: z.coerce.number().default(10)
    }),
    conversationId: z.object({
        conversationId: z.uuid({ message: "invalid conversation id" }).nonempty()
    }),
    membersAndmessages: z.object({
        members: z.coerce.number().default(10).optional(),
        messages: z.coerce.number().default(10).optional()
    }),
}

export declare namespace VConversation {
    type query = z.infer<typeof conversationValidator.query>
    type conversationId = z.infer<typeof conversationValidator.conversationId>
    type conversationAndMessages = z.infer<typeof conversationValidator.membersAndmessages>
}