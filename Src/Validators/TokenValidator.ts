import z from "zod";

export const TokenValidator = {
  tokenSchema: z.object({
    token: z.string().length(64, {
      message: "Token must be 64 characters long",
    }),
  }),
};
export type TokenValidator = z.infer<typeof TokenValidator.tokenSchema>;
