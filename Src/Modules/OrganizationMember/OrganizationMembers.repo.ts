import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { db } from "../../Database";
import { VAuth } from "../Auth/auth.validator";
import { organization_members } from "../../Database/schemas/organization_members.Schema";
import { organizations } from "../../Database/schemas/organization.Schema";
import { VOrganizationMember } from "./organizationMember.validator";
import { users } from "../../Database/schemas/users.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class OrganizationMembers {
  public async getForCurrentUser(data: VAuth.userId) {
    const { organizationId, ...memberColumns } = getTableColumns(organization_members)
    const foundOrganizations = await db.
      select({
        ...memberColumns,
        organization: { ...getTableColumns(organizations) }
      })
      .from(organization_members)
      .innerJoin(
        organizations,
        eq(organizations.id, organization_members.organizationId)
      ).where(eq(organization_members.userId, data.userId)
      )
    return foundOrganizations;
  }
  public async query(data: VOrganizationMember.organizationId & VOrganizationMember.query) {
    const { page = 1, limit = 5 } = data
    const _query = [eq(organization_members.organizationId, data.organizationId)]
    if (data.role) {
      _query.push(eq(organization_members.role, data.role))
    }
    const { userId, ...organizationMemberColumns } = getTableColumns(organization_members)
    const [foundMembers, total] = await Promise.all([
      db.select({
        ...organizationMemberColumns,
        user: { id: users.id, name: users.fullName, profile: users.profile },
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
    return (
      await tx
        .delete(organization_members)
        .where(
          and(
            eq(organization_members.organizationId, data.organizationId),
            eq(organization_members.id, data.organizationMemberId),
          ),
        ).returning())[0]
  }

  public async getById(data: VOrganizationMember.memberId) {
    return (
      await db
        .select({
          id: organization_members.id,
          organization: { id: organizations.id, name: organizations.name },
          user: { id: users.id, name: users.fullName, profile: users.profile },
          role: organization_members.role,
          createdAt: organization_members.createdAt,
          updatedAt: organization_members.updatedAt
        })
        .from(organization_members)
        .where(
          and(
            eq(organization_members.id, data.organizationMemberId),
            eq(organization_members.organizationId, data.organizationId),
          ),
        )
        .innerJoin(
          users,
          eq(users.id, organization_members.userId)
        )
        .innerJoin(
          organizations,
          eq(organizations.id, organization_members.organizationId)
        )
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
