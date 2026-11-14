import z from "zod";

export const userValidator = {
    userId: z.object({
        userId: z.uuid({ message: "Invalid type of userId" })
    }),
    query: z.object({
        search: z.string({ message: "search must be type of string" }).optional(),
        userId: z.uuid({ message: "invalid userId" }).optional(),
        limit: z.coerce.number({ message: "limit must be type of number" }).optional().default(10),
        page: z.coerce.number({ message: "page must be type of number" }).optional().default(1),
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
        profile: z.string().startsWith("data:image/", "Invalid image format").optional()
    }),
}
export declare namespace VUser {
    type query = z.infer<typeof userValidator.query>
    type update = z.infer<typeof userValidator.update>
    type userId = z.infer<typeof userValidator.userId>
}