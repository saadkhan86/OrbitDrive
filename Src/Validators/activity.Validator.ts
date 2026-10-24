import z from "zod";

export const activityValidator = {
  create: z.object({
    clientId: z
      .uuid({ message: "Invalid clientId" })
      .optional(),

    dealId: z
      .uuid({ message: "Invalid dealId" })
      .optional(),

    type: z.enum(["call", "email", "meeting", "note"], {
      message: "Invalid activity type",
    }),

    title: z
      .string({ message: "Invalid title" })
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(150, { message: "Title must be less than 150 characters" }),

    description: z
      .string({ message: "Invalid description" })
      .max(1000, {
        message: "Description must be less than 1000 characters",
      })
      .optional(),

    occurredAt: z.coerce
      .date({ message: "Invalid date format" })
      .optional(),
  }),

  update: z.object({
    clientId: z
      .uuid({ message: "Invalid clientId" })
      .nullable()
      .optional(),

    dealId: z
      .uuid({ message: "Invalid dealId" })
      .nullable()
      .optional(),

    type: z
      .enum(["call", "email", "meeting", "note"], {
        message: "Invalid activity type",
      })
      .optional(),

    title: z
      .string({ message: "Invalid title" })
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(150, { message: "Title must be less than 150 characters" })
      .optional(),

    description: z
      .string({ message: "Invalid description" })
      .max(1000, {
        message: "Description must be less than 1000 characters",
      })
      .nullable()
      .optional(),

    occurredAt: z.coerce
      .date({ message: "Invalid date format" })
      .nullable()
      .optional(),
  }),

  organizationId: z.object({
    organizationId: z
      .uuid({ message: "Invalid organizationId" }),
  }),

  activityId: z.object({
    organizationId: z
      .uuid({ message: "Invalid organizationId" }),

    activityId: z
      .uuid({ message: "Invalid activityId" }),
  }),

  clientId: z.object({
    organizationId: z
      .uuid({ message: "Invalid organizationId" }),

    clientId: z
      .uuid({ message: "Invalid clientId" }),
  }),

  dealId: z.object({
    organizationId: z
      .uuid({ message: "Invalid organizationId" }),

    dealId: z
      .uuid({ message: "Invalid dealId" }),
  }),
  query: z.object({
    search: z.string({ message: "search must be type of string" }).optional(),
    type: z
      .enum(["call", "email", "meeting", "note"], {
        message: "Invalid activity type",
      })
      .optional(),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10)
  })

};

export declare namespace VActivity {
  type create = z.infer<typeof activityValidator.create>;

  type update = z.infer<typeof activityValidator.update>;

  type organizationId = z.infer<typeof activityValidator.organizationId>;

  type activityId = z.infer<typeof activityValidator.activityId>;

  type clientId = z.infer<typeof activityValidator.clientId>;

  type dealId = z.infer<typeof activityValidator.dealId>;

  type query = z.infer<typeof activityValidator.query>
}
