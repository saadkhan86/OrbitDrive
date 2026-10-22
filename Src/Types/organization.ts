export const organizationRoles = [
  "OWNER",
  "ADMIN",
  "MEMBER",
  "VIEWER",
] as const;

export type OrganizationRole = (typeof organizationRoles)[number];
