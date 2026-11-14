import z from "zod";

export const verificationValidator = {
    query: z.object({
        action: z.enum(["verify-email", "resend-email"]),
        email: z.email().optional(),
        token: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.action === "resend-email") {
            if (!data.email) {
                ctx.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Email is required for resend-email",
                });
            } else if (!z.email().safeParse(data.email).success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Invalid email address",
                });
            }
        }

        if (data.action === "verify-email" && !data.token) {
            ctx.addIssue({
                code: "custom",
                path: ["token"],
                message: "Token is required for verify-email",
            });
        }
    }),
};

export declare namespace VVerification {
    type query = z.infer<typeof verificationValidator.query>;
}