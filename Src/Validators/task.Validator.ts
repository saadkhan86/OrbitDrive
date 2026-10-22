import z from "zod";

export const taskValidator = {
  create: z.object({
    clientId: z
      .string({ message: "Invalid clientId" })
      .uuid({ message: "Invalid clientId" })
      .optional(),

    dealId: z
      .string({ message: "Invalid dealId" })
      .uuid({ message: "Invalid dealId" })
      .optional(),

    assignedTo: z
      .string({ message: "Invalid assignedTo ID" })
      .uuid({ message: "Invalid assignedTo ID" }),

    title: z
      .string({ message: "Invalid title" })
      .min(10, {
        message: "Title must be greater than 10 characters",
      })
      .max(150, {
        message: "Title must be less than 150 characters",
      }),

    description: z
      .string({ message: "Invalid description" })
      .max(1000, {
        message: "Description must be less than 1000 characters",
      })
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"], {
        message: "Invalid priority",
      })
      .default("medium"),

    status: z
      .enum(["todo", "in_progress", "completed", "cancelled"], {
        message: "Invalid status",
      })
      .default("todo"),

    dueDate: z.coerce
      .date({
        message: "Invalid date format",
      })
      .meta({ example: new Date().toISOString() })
      .optional(),
  }),

  update: z.object({
    assignedTo: z
      .string({ message: "Invalid assignedTo ID" })
      .uuid({ message: "Invalid assignedTo ID" })
      .optional(),

    title: z
      .string({ message: "Invalid title" })
      .min(10, {
        message: "Title must be greater than 10 characters",
      })
      .max(150, {
        message: "Title must be less than 150 characters",
      })
      .optional(),

    description: z
      .string({ message: "Invalid description" })
      .max(1000, {
        message: "Description must be less than 1000 characters",
      })
      .nullable()
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"], {
        message: "Invalid priority",
      })
      .optional(),

    status: z
      .enum(["todo", "in_progress", "completed", "cancelled"], {
        message: "Invalid status",
      })
      .optional(),

    dueDate: z.coerce
      .date({
        message: "Invalid date format",
      })
      .meta({ example: "2026-10-09T15:30:00+05:00" })
      .nullable()
      .optional(),
  }),

  organizationId: z.object({
    organizationId: z
      .string({ message: "Invalid organizationId" })
      .uuid({ message: "Invalid organizationId" }),
  }),

  taskId: z.object({
    organizationId: z
      .string({ message: "Invalid organizationId" })
      .uuid({ message: "Invalid organizationId" }),

    taskId: z
      .string({ message: "Invalid taskId" })
      .uuid({ message: "Invalid taskId" }),
  }),
};

export declare namespace VTask {
  type create = z.infer<typeof taskValidator.create>;

  type update = z.infer<typeof taskValidator.update>;

  type organizationId = z.infer<typeof taskValidator.organizationId>;

  type taskId = z.infer<typeof taskValidator.taskId>;
}
