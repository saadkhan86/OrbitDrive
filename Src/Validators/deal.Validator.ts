import z from "zod";

export const dealValidator = {
  create: z.object({
    clientId: z.string().uuid(),

    title: z.string().min(1).max(150),

    value: z.number().nonnegative(),

    currency: z.string().length(3).default("USD"),

    stage: z
      .enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"])
      .default("lead"),

    expectedCloseDate: z.coerce.date().optional(),

    description: z.string().max(1000).optional(),
  }),

  update: z.object({
    title: z.string().min(1).max(150).optional(),

    value: z.number().nonnegative().optional(),

    currency: z.string().length(3).optional(),

    stage: z
      .enum(["lead", "qualified", "proposal", "negotiation", "won", "lost"])
      .optional(),

    expectedCloseDate: z.coerce.date().optional(),

    description: z.string().max(1000).optional(),
  }),

  dealId: z.object({
    dealId: z.string().uuid(),
  }),

  clientId: z.object({
    clientId: z.string().uuid(),
  }),
};

export declare namespace VDeal {
  type create = z.infer<typeof dealValidator.create>;
  type update = z.infer<typeof dealValidator.update>;
  type dealId = z.infer<typeof dealValidator.dealId>;
  type clientId = z.infer<typeof dealValidator.clientId>;
}
