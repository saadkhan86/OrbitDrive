import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organization_members } from "../Database/Schemas/organization_members.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VAuth } from "../Validators/auth.Validator";

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
  public async getAllByOrganizationId(org: VOrganizationMember.organizationId) {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.organizationId, org.organizationId));
  }
  public async getById(orgMember: VOrganizationMember.organizationMemberId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(
          and(
            eq(organization_members.id, orgMember.organizationMemberId),
            eq(organization_members.organizationId, orgMember.organizationId),
          ),
        )
    )[0];
  }
  public async getByOrganizationAndUserId(
    organizationId: string,
    userId: string,
  ) {
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
  public async getByUserId(user: VAuth.userId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(eq(organization_members.userId, user.userId))
    )[0];
  }
  public async updateOrganizationMember(
    orgMember: VOrganizationMember.organizationMemberId,
    data: VOrganizationMember.role,
  ) {
    return await db
      .update(organization_members)
      .set({ role: data.role })
      .where(
        and(
          eq(organization_members.organizationId, orgMember.organizationId),
          eq(organization_members.id, orgMember.organizationMemberId),
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
