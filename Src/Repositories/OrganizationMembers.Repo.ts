import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { db } from "../Database";
import { organization_members, } from "../Database/Schemas/organization_members.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganizationMember } from "../Validators/organizationMember.Validator";
import { VAuth } from "../Validators/auth.Validator";
import { users } from "../Database/Schemas/users.Schema";
import { organizations } from "../Database/Schemas/organization.Schema";

class OrganizationMembers {
  public async getForCurrentUser(data: VAuth.userId) {
    const foundOrganizations = await db.select({
      ...getTableColumns(organization_members),
      organization: { name: organizations.name }
    }).from(organization_members).innerJoin(organizations, eq(organizations.id, organization_members.organizationId)).where(eq(organization_members.userId, data.userId))
    return foundOrganizations;
  }
  public async query(data: VOrganizationMember.organizationId & VOrganizationMember.query) {
    const { page = 1, limit = 5 } = data
    const _query = [eq(organization_members.organizationId, data.organizationId)]
    if (data.role) {
      _query.push(eq(organization_members.role, data.role))
    }
    const [foundMembers, total] = await Promise.all([
      db.select({
        id: organization_members.id,
        organizationId: organization_members.organizationId,
        user: users.fullName,
        role: organization_members.role,
        createdAt: organization_members.createdAt,
        updatedAt: organization_members.updatedAt

      })
        .from(organization_members)
        .innerJoin(users, eq(users.id, organization_members.userId))
        .where(and(..._query))
        .orderBy(desc(organization_members.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ count: count() })
        .from(organization_members)
        .where(and(..._query))
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
        .select({
          ...getTableColumns(organization_members),
          user: { name: users.fullName }
        })
        .from(organization_members)
        .where(
          and(
            eq(organization_members.id, data.organizationMemberId),
            eq(organization_members.organizationId, data.organizationId),
          ),
        ).innerJoin(users, eq(users.id, organization_members.userId))
    )[0];
  }
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
