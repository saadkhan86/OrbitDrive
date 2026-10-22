import z from "zod";

export const userValidator = {
    query: z.object({
        search: z.string({ message: "search must be type of string" }).optional(),
        userId: z.uuid({ message: "invalid userId" }).optional(),
        limit: z.coerce.number({ message: "limit must be type of number" }).optional().default(10),
        page: z.coerce.number({ message: "page must be type of number" }).optional().default(1),
    })
}
export declare namespace VUser {
    type query = z.infer<typeof userValidator.query>
}