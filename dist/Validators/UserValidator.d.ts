import z from "zod";
export declare const Uservalidator: {
    signupValidator: z.ZodObject<{
        fullName: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
    loginValidator: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
    updateValidator: z.ZodObject<{
        fullName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
export type SignupValidator = z.infer<typeof Uservalidator.signupValidator>;
export type LoginValidator = z.infer<typeof Uservalidator.loginValidator>;
export type UpdateValidator = z.infer<typeof Uservalidator.updateValidator>;
//# sourceMappingURL=UserValidator.d.ts.map