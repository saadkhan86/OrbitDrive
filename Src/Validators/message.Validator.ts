import z from "zod";

export const messageValidator = {
    create: z.object({
        conversationId: z.uuid({ message: "invalid conversation id" }),
        content: z.coerce.string(),
    }),
    update: z.object({
        conversationId: z.uuid({ message: "invalid conversation id" }),
        messageId: z.uuid({ message: "invalid message id" }),
        content: z.coerce.string()
    })
}