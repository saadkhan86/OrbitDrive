import z from "zod";

export const conversationMemberValidator = {
    update: {
        action: z.enum(["add", "remove"], { message: "you can only add or remove members" }),
        participants: z.array(z.uuid({ message: "invalid participant id" }).min(1, { message: "atleast one participant is required for this action" }))
    }
}