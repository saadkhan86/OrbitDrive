import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organization_members } from "../Database/Schemas/organization_members.Schema";

class OrganizationMembers {
  public async getAllByOrganizationId(organizationId: string) {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.organizationId, organizationId));
  }
  public async getByUserId(userId: string, organizationId: string) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(
          and(
            eq(organization_members.userId, userId),
            eq(organization_members.organizationId, organizationId),
          ),
        )
    )[0];
  }
  public async updateOrganizationMember(
    organizationId: string,
    organizationMemberId: string,
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
  ) {
    return await db
      .update(organization_members)
      .set({ role })
      .where(
        and(
          eq(organization_members.organizationId, organizationId),
          eq(organization_members.userId, organizationMemberId),
        ),
      )
      .returning();
  }
  public async deleteOrganizationMember(
    organizationId: string,
    organizationMemberId: string,
  ) {
    await db
      .delete(organization_members)
      .where(
        and(
          eq(organization_members.organizationId, organizationId),
          eq(organization_members.id, organizationMemberId),
        ),
      );
    return;
  }
}
export default new OrganizationMembers();
