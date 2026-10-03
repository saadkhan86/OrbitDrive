import z, { decodeAsync } from "zod";
export const authValidator = {
  userId: z.object({
    userId: z
      .string({ message: "invalid userId" })
      .length(36, { message: "invalid length of userId" }),
  }),
  signup: z.object({
    fullName: z
      .string({ message: "invalid fullName" })
      .min(3, { message: `fullName must be greater than 3 characters` })
      .max(50, { message: "fullName must be smaller than 50 characters" }),
    email: z.email({ message: "invalid email" }),
    password: z
      .string({ message: "invalid password" })
      .min(6, { message: "password must be greater than 5 characters" })
      .max(20, { message: "password must be smaller than 20 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),
  }),

  login: z.object({
    email: z.email({ message: "invalid email" }),
    password: z
      .string({ message: "invalid password" })
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" }),
  }),
  update: z.object({
    fullName: z
      .string({ message: "invalid fullName" })
      .min(3, { message: `fullName must be greater than 3 characters` })
      .max(50, { message: "fullName must be smaller than 50 characters" })
      .optional(),
    password: z
      .string({ message: "invalid password" })
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      })
      .optional(),
  }),
  passwordReset: z.object({
    token: z.string({ message: "invalid token" }).length(64, {
      message: "Token must be 64 characters long",
    }),
    password: z
      .string()
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),
  }),
  email: z.object({
    email: z.email({ message: "invalid format of email" }),
  }),
  updateRefreshToken: z.object({
    userId: z.string({ message: "invalid user id" }),
    refreshToken: z.string({ message: "invalid refresh token" }),
  }),
  refreshToken: z.object({
    refreshToken: z.string({ message: "invalid refresh token" }).length(64, {
      message: "Refresh Token must be 64 characters long",
    }),
  }),
};
export declare namespace VAuth {
  interface create extends z.infer<typeof authValidator.signup> {}
  interface login extends z.infer<typeof authValidator.login> {}
  interface update extends z.infer<typeof authValidator.update> {}
  interface passwordReset extends z.infer<typeof authValidator.passwordReset> {}
  interface email extends z.infer<typeof authValidator.email> {}
  interface updateRefreshToken extends z.infer<
    typeof authValidator.updateRefreshToken
  > {}
  interface refreshToken extends z.infer<typeof authValidator.refreshToken> {}
  interface userId extends z.infer<typeof authValidator.userId> {}
}
