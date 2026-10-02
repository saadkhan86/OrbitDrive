import z from "zod";
export const authValidator = {
  userId: z.object({
    userId: z
      .string({
        error: (issue) =>
          issue.code == "invalid_type"
            ? `This ${issue.path} should be of ${issue.expected} type`
            : `This ${issue.path} is required`,
      })
      .length(36, {
        error: (issue) =>
          issue.code == "too_big" || issue.code == "too_small"
            ? `This ${issue.path} must be of length ${issue.maximum ?? issue.minimum}`
            : undefined,
      }),
  }),
  signup: z.object({
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

  login: z.object({
    email: z.email(),
    password: z.string().min(6).max(30),
  }),
  update: z.object({
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
    password: z
      .string()
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" })
      .optional(),
  }),
  passwordReset: z.object({
    token: z.string().length(64, {
      message: "Token must be 64 characters long",
    }),
    password: z
      .string()
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" }),
  }),
  email: z.object({
    email: z.email({
      error: (issue) =>
        issue.code == "invalid_format" || issue.code == "invalid_type"
          ? `This ${issue.path} must be a valid type`
          : undefined,
    }),
  }),
  updateRefreshToken: z.object({
    userId: z.string(),
    refreshToken: z.string(),
  }),
  refreshToken: z.object({
    refreshToken: z
      .string({
        error: (issue) =>
          issue.code === "invalid_type"
            ? "Token must be a string"
            : "Token is required",
      })
      .length(64, {
        message: "Refresh Token must be 64 characters long",
      }),
  }),
};
export type UserIdInputValidator = z.infer<typeof authValidator.userId>;
export type signupInputValidator = z.infer<typeof authValidator.signup>;
export type loginInputValidator = z.infer<typeof authValidator.login>;
export type updateInputValidator = z.infer<typeof authValidator.update>;
export type passwordResetInputValidator = z.infer<
  typeof authValidator.passwordReset
>;
export type emailInputValidator = z.infer<typeof authValidator.email>;
export type updateRefreshTokenInputValidator = z.infer<
  typeof authValidator.updateRefreshToken
>;
export type refreshTokenInputValidator = z.infer<
  typeof authValidator.refreshToken
>;
