import { z } from "zod";

export const organizationInvitationValidator = {
  organizationId: z.object({
    organizationId: z.string().uuid({ message: "Invalid organization ID" }),
  }),
  invitationId: z.object({
    organizationId: z.string().uuid({ message: "Invalid organizationId" }),
    invitationId: z.string().uuid({ message: "Invalid invitationId" }),
  }),
  create: z.object({
    email: z.email({ message: "Invalid email address" }),

    role: z.enum(["ADMIN", "MEMBER", "VIEWER"], { message: "invalid role" }),
  }),
  accept: z.object({
    token: z.string({ message: "invalid token" }),
  }),
};

export type OrganizationInvitationCreateInput = z.infer<
  typeof organizationInvitationValidator.create
>;

export type OrganizationInvitationAcceptInput = z.infer<
  typeof organizationInvitationValidator.accept
>;
export type OrganizationInvitationDeleteInput = z.infer<
  typeof organizationInvitationValidator.invitationId
>;
export type OrganizationInvitationOrganizationIdInput = z.infer<
  typeof organizationInvitationValidator.organizationId
>;
export type organizationInvitationIdInput = z.infer<
  typeof organizationInvitationValidator.invitationId
>;
