import z from "zod";
import { organizationRoles } from "../Types/organization";
export const organizationMemberValidator = {
  role: z.object({
    role: z.enum(organizationRoles, { message: "Invalid role selected" }),
  }),
  organizationId: z.object({
    organizationId: z.uuid({ message: "Invalid Organization Id" }),
  }),
  memberId: z.object({
    organizationId: z.uuid({ message: "Invalid Organization Id" }),
    organizationMemberId: z.uuid({ message: "Invalid Organization Member Id" }),
  }),
  query: z.object({
    role: z.enum(["owner", "admin", "member", "viewer"],
      { message: "invalid choice of role" }
    ).optional(),
    page: z.coerce.number({ message: "page must be type of number" }).default(1).optional(),
    limit: z.coerce.number({ message: "limit must be type of number" }).default(5).optional()
  }),
};
export declare namespace VOrganizationMember {
  type role = z.infer<typeof organizationMemberValidator.role>;
  type organizationId = z.infer<
    typeof organizationMemberValidator.organizationId
  >;
  type memberId = z.infer<
    typeof organizationMemberValidator.memberId
  >;
  type query = z.infer<typeof organizationMemberValidator.query>
}
