import z from "zod";

export const messageValidator = {
    Messagecontent: z.object({
        content: z.coerce.string().min(1, { message: "message can not be empty" })
    }),
    messageId: z.object({
        messageId: z.uuid({ message: "invalid message id" })
    }),

}
export declare namespace VMessageValidator {
    type MessageContent = z.infer<typeof messageValidator.Messagecontent>
    type messageId = z.infer<typeof messageValidator.messageId>
}