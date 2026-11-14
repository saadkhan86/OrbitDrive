import { and, count, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";
import { organizations } from "../../Database/schemas/organization.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganization } from "./organization.validator";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { VAuth } from "../Auth/auth.validator";

class OrganizationRepo {
  public async create(
    tx: NodePgDatabase,
    data: typeof organizations.$inferInsert,
  ) {
    return (
      await tx
        .insert(organizations)
        .values({ ownerId: data.ownerId, name: data.name, slug: data.slug })
        .returning({
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          ownerId: organizations.ownerId,
          createdAt: organizations.createdAt,
          updatedAt: organizations.updatedAt,
        })
    )[0];
  }
  public async getById(data: VOrganization.organizationId) {
    const organization = (await db
      .select({
        ...getTableColumns(organizations),
        owner: { name: users.fullName }
      })
      .from(organizations)
      .where(
        and(
          eq(organizations.id, data.organizationId)
        ),
      ).innerJoin(users, eq(organizations.ownerId, users.id))
    )[0]
    return organization
  }
  public async query(data: VAuth.userId & VOrganization.query) {
    const { page = 1, limit = 10 } = data
    const _query = [];
    _query.push(eq(organizations.ownerId, data.userId))
    if (data.search) {
      _query.push(or(ilike(organizations.name, `%${data.search}%`), ilike(organizations.slug, `%${data.search}%`)))
    }
    const [foundOrganizations, total] = await Promise.all([
      db.select().from(organizations).where(and(..._query)).orderBy(desc(organizations.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ count: count() }).from(organizations).where(and(..._query))
    ]);
    return { organizations: foundOrganizations, count: total[0]?.count ?? 0 };
  }
  public async update(
    data: VOrganization.organizationId &
      VOrganization.update &
      Partial<VOrganization.slug>
      & VAuth.userId
  ) {
    let newData: Record<string, any> = {};
    if (data.name) newData.name = data.name;
    if (data.slug) newData.slug = data.slug;
    return (
      await db
        .update(organizations)
        .set(newData)
        .where(and(eq(organizations.id, data.organizationId), eq(organizations.ownerId, data.userId)))
        .returning()
    )[0];
  }
  public async delete(data: VOrganization.organizationId & VAuth.userId) {
    return (
      await db
        .delete(organizations)
        .where(
          and(
            eq(organizations.id, data.organizationId),
            eq(organizations.ownerId, data.userId),
          ),
        )
        .returning()
    )[0];
  }
  public async getByOrganizationId(data: VOrganization.organizationId) {
    return (
      await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, data.organizationId))
    )[0];
  }
}
export default new OrganizationRepo();
