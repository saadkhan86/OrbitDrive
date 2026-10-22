import { z } from "zod";

export const organizationInvitationValidator = {
  organizationId: z.object({
    organizationId: z.string().uuid({ message: "Invalid organizationId" }),
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

export declare namespace VOrganizationInvitation {
  type create = z.infer<typeof organizationInvitationValidator.create>;
  type accept = z.infer<typeof organizationInvitationValidator.accept>;
  type invitationId = z.infer<
    typeof organizationInvitationValidator.invitationId
  >;
  type organizationId = z.infer<
    typeof organizationInvitationValidator.organizationId
  >;
  type token = z.infer<typeof organizationInvitationValidator.accept>;
}
