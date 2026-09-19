import z from "zod";
export const organizationMemberValidator = {
  role: z.object({
    role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
  }),
  organizationId: z.object({
    organizationId: z.string().uuid("Invalid Organization Id"),
  }),
  organizationMemberId: z.object({
    organizationId: z.string().uuid("Invalid Organization Id"),
    organizationMemberId: z.string().uuid("Invalid Organization Member Id"),
  }),
};
export type organizationMemberRoleValidator = z.infer<
  typeof organizationMemberValidator.role
>;
export type organizationMemberOrganizationIdValidator = z.infer<
  typeof organizationMemberValidator.organizationId
>;
export type organizationMemberOrganizationMemberIdValidator = z.infer<
  typeof organizationMemberValidator.organizationMemberId
>;
