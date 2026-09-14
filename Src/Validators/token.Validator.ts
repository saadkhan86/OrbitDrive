import z from "zod";

export const tokenValidator = {
  tokenSchema: z.object({
    token: z.string().length(64, {
      message: "Token must be 64 characters long",
    }),
  }),
};
export const refreshTokenSchema = z.object({
  token: z.string({
    error: (issue) =>
      issue.code === "invalid_type"
        ? "Token must be a string"
        : "Token is required",
  }),
});
export type tokenValidator = z.infer<typeof tokenValidator.tokenSchema>;
export type refreshTokenValidator = z.infer<typeof refreshTokenSchema>;
