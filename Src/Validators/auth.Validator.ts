import z from "zod";
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
      .max(50, { message: "fullName must be smaller than 50 characters" })
      .meta({ example: "saad Muhammad Bin Ramzan" }),
    email: z
      .email({ message: "invalid email" })
      .meta({ example: "sk8613013@gmail.com" }),
    password: z
      .string({ message: "invalid password" })
      .min(6, { message: "password must be greater than 5 characters" })
      .max(20, { message: "password must be smaller than 20 characters" })
      .meta({ example: "Sk8613013@" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
          "Password must contain uppercase, lowercase, number and special character",
      }),
  }),

  login: z.object({
    email: z
      .email({ message: "invalid email" })
      .meta({ example: "sk8613013@gmail.com" }),
    password: z
      .string({ message: "invalid password" })
      .min(6, { message: "password must be greater than 5 characters" })
      .max(30, { message: "password must be smaller than 30 characters" })
      .meta({ example: "Sk8613013@" }),
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
      .meta({ example: "Sk8613013@#" })
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
    email: z
      .email({ message: "invalid format of email" })
      .meta({ example: "sk8613013@gmail.com" }),
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
  type create = z.infer<typeof authValidator.signup>;
  type login = z.infer<typeof authValidator.login>;
  type update = z.infer<typeof authValidator.update>;
  type passwordReset = z.infer<typeof authValidator.passwordReset>;
  type email = z.infer<typeof authValidator.email>;
  type updateRefreshToken = z.infer<typeof authValidator.updateRefreshToken>;
  type refreshToken = z.infer<typeof authValidator.refreshToken>;
  type userId = z.infer<typeof authValidator.userId>;
}
