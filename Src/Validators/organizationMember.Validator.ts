import z from "zod";
import { organizationRoles } from "../Types/organization";
export const organizationMemberValidator = {
  role: z.object({
    role: z.enum(organizationRoles, { message: "Invalid role selected" }),
  }),
  organizationId: z.object({
    organizationId: z.string().uuid("Invalid Organization Id"),
  }),
  organizationMemberId: z.object({
    organizationId: z.string().uuid("Invalid Organization Id"),
    organizationMemberId: z.string().uuid("Invalid Organization Member Id"),
  }),
};
export declare namespace VOrganizationMember {
  export type role = z.infer<typeof organizationMemberValidator.role>;
  export type organizationId = z.infer<
    typeof organizationMemberValidator.organizationId
  >;
  export type organizationMemberId = z.infer<
    typeof organizationMemberValidator.organizationMemberId
  >;
}
