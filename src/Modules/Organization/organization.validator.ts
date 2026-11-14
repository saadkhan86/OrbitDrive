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
        .coerce
        .string({
          message: "invalid name of organization",
        })
        .min(3, { message: "name must be greater than 3 characters" })
        .max(100, { message: "name must be smaller than 100 characters" })
    }),

  organizationId: z.object({
    organizationId: z.uuid("invalid uuid format of organizationId"),
  }),


  slug: z.object({
    slug: z.string(),
  }),

  query: z.object({
    search: z.string({ message: "search must be type of string" }).optional(),
    page: z.coerce.number({ message: "page must be type of number" }).default(1).optional(),
    limit: z.coerce.number({ message: "limit must be type of number" }).default(10).optional(),
  })
};
export declare namespace VOrganization {
  type create = z.infer<typeof organizationValidator.create>;
  type update = z.infer<typeof organizationValidator.update>;
  type organizationId = z.infer<typeof organizationValidator.organizationId>;
  type slug = z.infer<typeof organizationValidator.slug>;
  type query = z.infer<typeof organizationValidator.query>
}
