import z from "zod";

export const conversationValidator = {
    create: z.object({
        type: z.enum(["direct", "group"]).default("direct"),
        name: z.coerce.string().optional(),
        participants: z.array(z.uuid({ message: "invalid participant id" }).min(1, { message: "atleast one participant is required" }).nonempty())
    }).refine((data) =>
        data.type == "group" && data.name == "",
        { abort: true, message: "group name is required" }
    ),
    query: z.object({
        search: z.coerce.string().optional(),
        page: z.coerce.number().optional(),
        limit: z.coerce.number().optional()
    }),
    conversationId: z.object({
        conversationId: z.uuid({ message: "invalid conversation id" }).nonempty()
    }),
    membersAndmessages: z.object({
        members: z.coerce.number().default(5).optional(),
        messages: z.coerce.number().default(30).optional()
    }),
    update: z.object({
        name: z.coerce.string(),
    })
}

export declare namespace VConversation {
    type create = z.infer<typeof conversationValidator.create>
    type query = z.infer<typeof conversationValidator.query>
    type conversationId = z.infer<typeof conversationValidator.conversationId>
    type conversationAndMessages = z.infer<typeof conversationValidator.membersAndmessages>
    type update = z.infer<typeof conversationValidator.update>
}