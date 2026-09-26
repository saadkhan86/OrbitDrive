import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organizations } from "../Database/Schemas/organization.Schema";

class OrganizationRepo {
  public async create(ownerId: string, data: { name: string; slug: string }) {
    return (
      await db
        .insert(organizations)
        .values({ ownerId, name: data.name, slug: data.slug })
        .returning()
    )[0];
  }
  public async getById(ownerId: string, organizationId: string) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(
            eq(organizations.id, organizationId),
            eq(organizations.ownerId, ownerId),
          ),
        )
    )[0];
  }
  public async findByOwnerAndSlug(ownerId: string, slug: string) {
    return (
      await db
        .select()
        .from(organizations)
        .where(
          and(eq(organizations.ownerId, ownerId), eq(organizations.slug, slug)),
        )
    )[0];
  }
  public async getAllByOwnerId(ownerId: string) {
    return await db
      .select()
      .from(organizations)
      .where(eq(organizations.ownerId, ownerId));
  }
  public async update(
    organizationId: string,
    data: { name?: string; slug?: string },
  ) {
    let newData: Record<string, any> = {};
    if (data.name) newData.name = data.name;
    if (data.slug) newData.slug = data.slug;
    return (
      await db
        .update(organizations)
        .set(newData)
        .where(eq(organizations.id, organizationId))
        .returning()
    )[0];
  }
  public async delete(ownerId: string, organizationId: string) {
    return (
      await db
        .delete(organizations)
        .where(
          and(
            eq(organizations.id, organizationId),
            eq(organizations.ownerId, ownerId),
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
