import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../Database";
import { organizations } from "../Database/Schemas/organization.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VAuth } from "../Validators/auth.Validator";
import { VOrganization } from "../Validators/organization.Validator";
class OrganizationRepo {
  public async create(
    tx: NodePgDatabase,
    data: typeof organizations.$inferInsert,
  ) {
    console.log("data", data)
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
  public async getById(data: VAuth.userId & VOrganization.getById) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(
            eq(organizations.id, data.organizationId),
            eq(organizations.ownerId, data.userId),
          ),
        )
    )[0];
  }
  public async findByOwnerAndSlug(data: VAuth.userId & VOrganization.slug) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(
            eq(organizations.ownerId, data.userId),
            eq(organizations.slug, data.slug),
          ),
        )
    )[0];
  }
  public async query(data: VAuth.userId & VOrganization.query) {
    const { page = 1, limit = 10 } = data
    const _query = [];
    _query.push(eq(organizations.ownerId, data.userId))
    if (data.search) {
      _query.push(or(ilike(organizations.name, `%${data.search}%`), ilike(organizations.slug, `%${data.search}%`)))
    }
    const totalCount = await db.select({ count: count() }).from(organizations).where(and(..._query)).limit(limit).offset((page - 1) * limit);
    const result = await db.select().from(organizations).where(and(..._query));
    return { result, count: totalCount[0]?.count ?? 0 };
  }
  public async update(
    data: VOrganization.getById &
      VOrganization.update &
      Partial<VOrganization.slug>,
  ) {
    let newData: Record<string, any> = {};
    if (data.name) newData.name = data.name;
    if (data.slug) newData.slug = data.slug;
    return (
      await db
        .update(organizations)
        .set(newData)
        .where(eq(organizations.id, data.organizationId))
        .returning()
    )[0];
  }
  public async delete(data: VOrganization.remove & VAuth.userId) {
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
  public async getByOrganizationId(data: VOrganization.getById) {
    return (
      await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, data.organizationId))
    )[0];
  }
}
export default new OrganizationRepo();
