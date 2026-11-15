import { z } from "zod";

export const organizationInvitationValidator = {
  organizationId: z.object({
    organizationId: z.uuid({ message: "Invalid organizationId" }),
  }),
  invitationId: z.object({
    organizationId: z.uuid({ message: "Invalid organizationId" }),
    invitationId: z.uuid({ message: "Invalid invitationId" }),
  }),
  create: z.object({
    email: z.email({ message: "Invalid email address" }),

    role: z.enum(["admin", "member", "viewer"], { message: "invalid role" }),
  }),
  query: z.object({
    search: z.coerce.string({ message: "search must be type of string" }).optional(),
    role: z.enum(["admin", "member", "viewer"], { message: "invalid role" }).optional(),
    createdBy: z.uuid({ message: "createdBy must be type of uuid" }).optional(),
    page: z.coerce.number({ message: "page must be type of number" }).default(1).optional(),
    limit: z.coerce.number({ message: "limit must be type of number" }).default(10).optional(),

  }),
  accept: z.object({
    token: z.coerce.string({ message: "invalid token" }).length(32, { message: "invalid token passed" }),
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
  type query = z.infer<typeof organizationInvitationValidator.query>;
}
