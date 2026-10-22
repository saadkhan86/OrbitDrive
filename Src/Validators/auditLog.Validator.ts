import z from "zod";

export const auditLogValidator = {
  organizationId: z.object({
    organizationId: z.string().uuid({ message: "Invalid organization ID" }),
  }),

  auditLogId: z.object({
    organizationId: z.string().uuid({ message: "Invalid organization ID" }),

    auditLogId: z.string().uuid({ message: "Invalid audit log ID" }),
  }),
};

export declare namespace VAuditLog {
  type organizationId = z.infer<typeof auditLogValidator.organizationId>;

  type auditLogId = z.infer<typeof auditLogValidator.auditLogId>;
}
