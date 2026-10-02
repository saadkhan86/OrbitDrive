import { z } from "zod";

export const clientValidator = {
  // Params
  organizationId: z.object({
    organizationId: z.string().uuid("Invalid organization ID"),
  }),

  clientId: z.object({
    organizationId: z.string().uuid("Invalid organization ID"),
    clientId: z.string().uuid("Invalid client ID"),
  }),

  create: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Client name is required")
      .max(255, "Client name is too long"),

    email: z.string().trim().toLowerCase().email("Invalid email address"),

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
        .string()
        .trim()
        .toLowerCase()
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
};

// Types
export type OrganizationIdParams = z.infer<
  typeof clientValidator.organizationId
>;

export type ClientIdParams = z.infer<typeof clientValidator.clientId>;

export type CreateClientInput = z.infer<typeof clientValidator.create>;

export type UpdateClientInput = z.infer<typeof clientValidator.update>;
