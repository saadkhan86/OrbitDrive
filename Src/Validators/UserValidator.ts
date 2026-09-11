import z from "zod";
export const Uservalidator = {
  signupValidator: z.object({
    fullName: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .min(3, { message: `fullName must be greater than 3 characters` })
      .max(50, { message: "fullName must be smaller than 50 characters" }),
    email: z.email(),
    password: z
      .string()
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" }),
  }),

  loginValidator: z.object({
    email: z.email(),
    password: z.string().min(6).max(30),
  }),
  updateValidator: z.object({
    id: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .length(24, { message: "id must be of 24 characters" }),
    fullName: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? `This ${issue.path} should be of type ${issue.expected}`
            : `This ${issue.path} is required`,
      })
      .min(3, { message: `fullName must be greater than 3 characters` })
      .max(50, { message: "fullName must be smaller than 50 characters" })
      .optional(),
  }),
};
export type SignupValidator = z.infer<typeof Uservalidator.signupValidator>;
export type LoginValidator = z.infer<typeof Uservalidator.loginValidator>;
export type UpdateValidator = z.infer<typeof Uservalidator.updateValidator>;
