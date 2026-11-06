import z from "zod";

export const conversationValidator = {
    create: z.object({
        type: z.enum(["direct", "group"]).default("direct"),
        name: z.coerce.string().optional(),
        participants: z.array(z.uuid({ message: "invalid participant id" })).min(1, { message: "atleast one participant is required" }).nonempty()
    }).refine((data) =>
        data.type == "group" && data.name == "",
        { abort: true, message: "group name is required" }
    ),
    query: z.object({
        search: z.coerce.string(),
        page: z.coerce.number(),
        limit: z.coerce.number()
    }),
    conversationId: z.object({
        conversationId: z.uuid({ message: "invalid conversation id" })
    })

}

export declare namespace VConversation {
    type Create = z.infer<typeof conversationValidator.create>
    type Query = z.infer<typeof conversationValidator.query>
    type ConversationId = z.infer<typeof conversationValidator.conversationId>
}