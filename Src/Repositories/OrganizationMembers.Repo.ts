import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organization_members } from "../Database/Schemas/organization_members.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class OrganizationMembers {
  public async createOrganizationMember(
    tx: NodePgDatabase,
    data: typeof organization_members.$inferInsert,
  ) {
    return (
      await tx
        .insert(organization_members)
        .values({
          organizationId: data.organizationId,
          userId: data.userId,
          role: data.role,
        })
        .returning()
    )[0];
  }
  public async getAllByOrganizationId(organizationId: string) {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.organizationId, organizationId));
  }
  public async getByOrganizationAndUserId(
    organizationId: string,
    userId: string,
  ) {
    return await db
      .select()
      .from(organization_members)
      .where(
        and(
          eq(organization_members.userId, userId),
          eq(organization_members.id, organizationId),
        ),
      );
  }
  public async getByUserId(userId: string) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(eq(organization_members.userId, userId))
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
