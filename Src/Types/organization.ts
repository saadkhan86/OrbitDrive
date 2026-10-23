export const organizationRoles = [
  "owner",
  "admin",
  "member",
  "viewer",
] as const;

export type OrganizationRole = (typeof organizationRoles)[number];
