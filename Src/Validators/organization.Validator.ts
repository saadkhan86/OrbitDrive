import z, { object } from "zod";

export const organizationValidator = {
  create: z.object({
    name: z
      .string({ message: "invalid name of organization" })
      .min(5, { message: "name must be greater than 5 characters" })
      .max(100, { message: "name must be smaller than 100 characters" }),
  }),
  update: z
    .object({
      name: z
        .string({
          message: "invalid name of organization",
        })
        .min(5, { message: "name must be greater than 5 characters" })
        .max(100, { message: "name must be smaller than 100 characters" })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      abort: true,
      message: "At least one field is required",
    }),
  organizationId: z.object({
    organizationId: z
      .string({ message: "invalid format of organizationId" })
      .length(36, {
        message: "invalid length of organizationId",
      }),
  }),
};
export declare namespace VOrganization {
  interface create extends z.infer<typeof organizationValidator.create> {}
  interface update extends z.infer<typeof organizationValidator.update> {}
  interface getById extends z.infer<
    typeof organizationValidator.organizationId
  > {}
  interface remove extends z.infer<
    typeof organizationValidator.organizationId
  > {}
}
