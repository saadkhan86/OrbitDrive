import z from "zod";

export const dealValidator = {
  create: z.object({
    clientId: z.string().uuid({ message: "invalid clientId" }),

    title: z
      .string({ message: "title must be of type string" })
      .min(5, { message: "title must be greater than 5 characters" })
      .max(150, { message: "title must be less than 150 characters" }),

    value: z
      .number({ message: "value must be type of number" })
      .nonnegative({ message: "value cannot be negative" }),

    currency: z
      .string()
      .length(3, { message: "invalid currency" })
      .default("USD"),

    stage: z
      .enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"], {
        message: "invalid stage passed",
      })
      .default("lead"),

    expectedCloseDate: z.coerce.date().optional(),

    description: z.string().max(1000).optional(),
  }),

  update: z
    .object({
      title: z
        .string()
        .min(5, { message: "title must between 5-150 characters" })
        .max(150, { message: "title must between 5-150 characters" })
        .optional(),

      value: z
        .number()
        .nonnegative({ message: "value can not be negative" })
        .optional(),

      currency: z
        .string()
        .length(3, { message: "invalid currency" })
        .optional(),

      stage: z
        .enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"], {
          message: "invalid stage passed",
        })
        .optional(),

      expectedCloseDate: z.coerce.date().optional(),

      description: z.string().max(1000).optional(),
    })
    .refine((data) => Object.keys.length > 0, {
      abort: true,
      message: "At least one field is required",
    }),

  dealId: z.object({
    dealId: z.string().uuid({ message: "invalid dealId" }),
    organizationId: z.string().uuid({ message: "invalid organizationId" }),
  }),

  clientId: z.object({
    clientId: z.string().uuid({ message: "invalid clientId" }),
  }),
  organizationId: z.object({
    organizationId: z.string().uuid({ message: "invalid organizationId" }),
  }),
};

export declare namespace VDeal {
  type create = z.infer<typeof dealValidator.create>;
  type update = z.infer<typeof dealValidator.update>;
  type dealId = z.infer<typeof dealValidator.dealId>;
  type clientId = z.infer<typeof dealValidator.clientId>;
  type organizationId = z.infer<typeof dealValidator.organizationId>;
}
