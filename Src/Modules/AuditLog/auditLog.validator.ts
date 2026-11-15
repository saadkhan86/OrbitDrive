import z from "zod";

export const auditLogValidator = {
  organizationId: z.object({
    organizationId: z.uuid({ message: "Invalid organization ID" }),
  }),

  auditLogId: z.object({
    organizationId: z.uuid({ message: "Invalid organization ID" }),

    auditLogId: z.uuid({ message: "Invalid audit log ID" }),
  }),
  query: z.object({
    action: z.enum(["create", "update", "delete", "invite", "join"]).optional(),
    entityType: z.enum(["organization_member", "organization_invite", "deal", "client", "task", "activity"]).optional(),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10)
  })
};

export declare namespace VAuditLog {
  type organizationId = z.infer<typeof auditLogValidator.organizationId>;

  type auditLogId = z.infer<typeof auditLogValidator.auditLogId>;
  type query = z.infer<typeof auditLogValidator.query>
}

