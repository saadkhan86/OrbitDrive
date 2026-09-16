import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { organizations } from "../Database/Schemas/organization.Schema";
import { users } from "../Database/Schemas/users.Schema";
import { own } from "zod/v4/core/util.cjs";

class OrganizationRepo {
  public async create(ownerId: string, data: { name: string; slug: string }) {
    return (
      await db
        .insert(organizations)
        .values({ ownerId, name: data.name, slug: data.slug })
        .returning()
    )[0];
  }
  public async getById(organizationId: string, ownerId: string) {
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
  public async getAll(ownerId: string) {
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
    return (await db.update(organizations).set(newData).returning())[0];
  }
}
export default new OrganizationRepo();
