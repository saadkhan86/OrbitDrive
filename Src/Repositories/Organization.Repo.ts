import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organizations } from "../Database/Schemas/organization.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UserIdInputValidator } from "../Validators/auth.Validator";
import { OrganizationIdInputValidator } from "../Validators/organization.Validator";

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
  public async getById(
    user: UserIdInputValidator,
    org: OrganizationIdInputValidator,
  ) {
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
    org: OrganizationIdInputValidator,
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
    user: UserIdInputValidator,
    org: OrganizationIdInputValidator,
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
