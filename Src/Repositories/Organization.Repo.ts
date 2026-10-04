import { and, eq } from "drizzle-orm";
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
    return (
      await tx
        .insert(organizations)
        .values({ ownerId: data.ownerId, name: data.name, slug: data.slug })
        .returning()
    )[0];
  }
  public async getById(user: VAuth.userId, org: VOrganization.getById) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(
            eq(organizations.id, org.organizationId),
            eq(organizations.ownerId, user.userId),
          ),
        )
    )[0];
  }
  public async findByOwnerAndSlug(user: VAuth.userId, slug: string) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(
            eq(organizations.ownerId, user.userId),
            eq(organizations.slug, slug),
          ),
        )
    )[0];
  }
  public async getAllByOwnerId(user: VAuth.userId) {
    return await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, user.userId));
  }
  public async update(
    org: VOrganization.getById,
    data: { name?: string; slug?: string },
  ) {
    let newData: Record<string, any> = {};
    if (data.name) newData.name = data.name;
    if (data.slug) newData.slug = data.slug;
    return (
      await db
        .update(organizations)
        .set(newData)
        .where(eq(organizations.id, org.organizationId))
        .returning()
    )[0];
  }
  public async delete(
    user: VAuth.userId,
    org: VOrganization.getById,
  ) {
    return (
      await db
        .delete(organizations)
        .where(
          and(
            eq(organizations.id, org.organizationId),
            eq(organizations.ownerId, user.userId),
          ),
        )
        .returning()
    )[0];
  }
  public async getByOrganizationId(organizationId: string) {
    return (
      await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, organizationId))
    )[0];
  }
}
export default new OrganizationRepo();
