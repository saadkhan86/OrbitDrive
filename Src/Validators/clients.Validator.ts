import { z } from "zod";

export const clientValidator = {
  // Params
  organizationId: z.object({
    organizationId: z.uuid("Invalid organization ID"),
  }),

  clientId: z.object({
    organizationId: z.uuid("Invalid organization ID"),
    clientId: z.uuid("Invalid client ID"),
  }),

  create: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Client name is required")
      .max(255, "Client name is too long"),

    email: z.email("Invalid email address"),

    phone: z.string().trim().max(30, "Phone number is too long"),

    company: z.string().trim().max(255, "Company name is too long"),

    status: z
      .enum(["active", "inactive", "prospect", "customer", "lead", "vip"])
      .optional()
      .default("active"),

    notes: z.string().trim(),
  }),

  // Update Client
  update: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Client name cannot be empty")
        .max(255, "Client name is too long")
        .optional(),

      email: z
        .email("Invalid email address")
        .optional(),

      phone: z.string().trim().max(30, "Phone number is too long").optional(),

      company: z
        .string()
        .trim()
        .max(255, "Company name is too long")
        .optional(),

      status: z
        .enum(["active", "inactive", "prospect", "customer", "lead", "vip"])
        .optional(),

      notes: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
  query: z.object({
    search: z.string(),
    status: z.enum(["active", "inactive", "prospect", "customer", "lead", "vip"]).optional(),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10),
  })
};

export declare namespace VClient {
  type OrganizationIdParams = z.infer<typeof clientValidator.organizationId>;
  type ClientIdParams = z.infer<typeof clientValidator.clientId>;
  type CreateClientInput = z.infer<typeof clientValidator.create>;
  type UpdateClientInput = z.infer<typeof clientValidator.update>;
  type query = z.infer<typeof clientValidator.query>;
}
