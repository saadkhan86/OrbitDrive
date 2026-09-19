import z from "zod";

export const sharedValidator = {
  id: z.string().uuid("Invalid Id"),
};
export type idValidator = z.infer<typeof sharedValidator.id>;
