import z, { email } from "zod";

export const EmailValidator = {
  emailSchema: z.object({
    email: z.email(),
  }),
};
export type EmailValidator = z.infer<typeof EmailValidator.emailSchema>;
