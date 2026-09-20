import z from "zod";
import { organizationRoles } from "../Types/organization";
export const organizationMemberValidator = {
  role: z.object({
    role: z.enum(organizationRoles),
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
