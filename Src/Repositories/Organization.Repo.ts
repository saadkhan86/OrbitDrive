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
  public async getAllByOwnerId(data: VAuth.userId) {
    return await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, data.userId));
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
  public async delete(user: VAuth.userId, org: VOrganization.getById) {
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
