import { z } from "zod";

export const organizationInvitationValidator = {
  // POST /organizations/:organizationId/invitations
  organizationId: z.object({
    organizationId: z.string().uuid("Invalid organization ID"),
  }),

  // DELETE /organizations/:organizationId/invitations/:invitationId
  invitationId: z.object({
    organizationId: z.string().uuid("Invalid organization ID"),

    invitationId: z.string().uuid("Invalid invitation ID"),
  }),

  // Create invitation body
  create: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),

    role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
  }),
  // POST /invitations/accept
  accept: z.object({
    token: z.string().trim().min(1, "Invitation token is required"),
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
export type OrganizationIdInput = z.infer<
  typeof organizationInvitationValidator.organizationId
>;
