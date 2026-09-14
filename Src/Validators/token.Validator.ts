import z from "zod";

export const tokenValidator = {
  tokenSchema: z.object({
    token: z.string().length(64, {
      message: "Token must be 64 characters long",
    }),
  }),
};
export type tokenValidator = z.infer<typeof tokenValidator.tokenSchema>;
