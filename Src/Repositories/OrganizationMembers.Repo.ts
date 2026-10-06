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
  public async getAllByOrganizationId(
    data: VOrganizationMember.organizationId,
  ) {
    return await db
      .select()
      .from(organization_members)
      .where(eq(organization_members.organizationId, data.organizationId));
  }
  public async getById(data: VOrganizationMember.organizationMemberId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(
          and(
            eq(organization_members.userId, data.organizationMemberId),
            eq(organization_members.organizationId, data.organizationId),
          ),
        )
    )[0];
  }
  public async getByOrganizationAndUserId(
    data: VOrganizationMember.organizationMemberId,
  ) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(
          and(
            eq(organization_members.userId, data.organizationMemberId),
            eq(organization_members.organizationId, data.organizationId),
          ),
        )
    )[0];
  }
  public async getByUserId(data: VAuth.userId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(eq(organization_members.userId, data.userId))
    )[0];
  }
  public async updateOrganizationMember(
    data: VOrganizationMember.role & VOrganizationMember.organizationMemberId,
  ) {
    return await db
      .update(organization_members)
      .set({ role: data.role })
      .where(
        and(
          eq(organization_members.organizationId, data.organizationId),
          eq(organization_members.id, data.organizationMemberId),
        ),
      )
      .returning();
  }
  public async deleteOrganizationMember(
    data: VOrganizationMember.organizationMemberId,
  ) {
    await db
      .delete(organization_members)
      .where(
        and(
          eq(organization_members.organizationId, data.organizationId),
          eq(organization_members.id, data.organizationMemberId),
        ),
      );
    return;
  }
}
export default new OrganizationMembers();
