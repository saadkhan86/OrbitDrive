import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organization_members } from "../Database/Schemas/organization_members";
import { idValidator } from "../Validators/shared.Validator";

export const organizationMemberService = {
  getAllByOrganizationId: async (organizationId: idValidator) => {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.organizationId, organizationId));
  },

  getAllByOwnerId: async (ownerId: idValidator) => {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.userId, ownerId));
  },

  getByUserId: async (organizationId: idValidator, userId: idValidator) => {
    return await db
      .select()
      .from(organization_members)
      .where(
        and(
          eq(organization_members.organizationId, organizationId),
          eq(organization_members.userId, userId),
        ),
      );
  },
};
