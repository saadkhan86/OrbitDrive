import z from "zod";

export const userValidator = {
    userId: z.object({
        userId: z.uuid({ message: "Invalid type of userId" })
    }),
    query: z.object({
        search: z.string({ message: "search must be type of string" }).optional(),
        userId: z.uuid({ message: "invalid userId" }).optional(),
        limit: z.coerce.number({ message: "limit must be type of number" }).default(10),
        cursor: z.string().optional(),
    }).refine((data) => data.search || data.userId, {
        abort: true,
        message: "At least one of search or userId is required",
    }),
    update: z.object({
        fullName: z
            .string({ message: "invalid fullName" })
            .min(3, { message: `fullName must be greater than 3 characters` })
            .max(50, { message: "fullName must be smaller than 50 characters" })
            .meta({ example: "saad" })
            .optional(),
        password: z
            .string({ message: "invalid password" })
            .min(6, { message: "password must be greater than 5 characters" })
            .max(30, { message: "password must be smaller than 30 characters" })
            .meta({ example: "Sk8613013@" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
                message:
                    "Password must contain uppercase, lowercase, number and special character",
            })
            .optional(),
        profile: z.object({
            avatar: z.string({ message: "image must be type of string" }).optional(),
            bio: z.coerce.string().max(300).optional()
        })
            .optional()
    }).refine((data) => Object.keys(data).length > 0, {
        message: "atleast one field is required for update"
    }),
}
export declare namespace VUser {
    type query = z.infer<typeof userValidator.query>
    type update = z.infer<typeof userValidator.update>
    type userId = z.infer<typeof userValidator.userId>
}