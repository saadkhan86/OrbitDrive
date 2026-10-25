import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../Database";
import { organization_members, } from "../Database/Schemas/organization_members.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VAuth } from "../Validators/auth.Validator";

class OrganizationMembers {
  public async query(data: VOrganizationMember.organizationId & VOrganizationMember.query) {
    const { page = 1, limit = 5 } = data
    const _query = [eq(organization_members.organizationId, data.organizationId)]
    if (data.role) {
      _query.push(eq(organization_members.role, data.role))
    }
    const [foundMembers, total] = await Promise.all([
      db.select().from(organization_members).where(and(..._query)).orderBy(desc(organization_members.createdAt)).limit(limit).offset((page - 1) * limit),
      await db.select({ count: count() }).from(organization_members).where(and(..._query))
    ])
    return { organizationMembers: foundMembers, count: total[0]?.count ?? 0 }
  }
  public async create(
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
  public async update(
    data: VOrganizationMember.role & VOrganizationMember.memberId,
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
  public async delete(
    tx: NodePgDatabase,
    data: VOrganizationMember.memberId,
  ) {
    await tx
      .delete(organization_members)
      .where(
        and(
          eq(organization_members.organizationId, data.organizationId),
          eq(organization_members.id, data.organizationMemberId),
        ),
      );
    return;
  }

  public async getById(data: VOrganizationMember.memberId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(
          and(
            eq(organization_members.id, data.organizationMemberId),
            eq(organization_members.organizationId, data.organizationId),
          ),
        )
    )[0];
  }
  // public async getByOrganizationMemberUserId(
  //   data: VOrganizationMember.organizationId & VAuth.userId
  // ) {
  //   return (
  //     await db
  //       .select()
  //       .from(organization_members)
  //       .where(
  //         and(eq(organization_members.userId, data.userId), eq(organization_members.organizationId, data.organizationId))
  //       )
  //   )[0];
  // }
  public async getByUserId(data: VOrganizationMember.organizationId & VAuth.userId) {
    return (
      await db
        .select()
        .from(organization_members)
        .where(and(eq(organization_members.userId, data.userId), eq(organization_members.organizationId, data.organizationId)))
    )[0];
  }
}
export default new OrganizationMembers();
