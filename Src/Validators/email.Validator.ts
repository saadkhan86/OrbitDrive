import z, { email } from "zod";

export const emailValidator = {
  emailSchema: z.object({
    email: z.email(),
  }),
};
export type emailValidator = z.infer<typeof emailValidator.emailSchema>;
