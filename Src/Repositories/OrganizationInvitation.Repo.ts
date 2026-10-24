import { and, count, desc, eq, ilike } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";
import { VAuth } from "../Validators/auth.Validator";

class OrganizationInvitationRepo {
  public async create(tx: NodePgDatabase, data: typeof organization_invitations.$inferInsert) {
    return (
      await tx
        .insert(organization_invitations)
        .values({ ...data, acceptedAt: null })
        .returning()
    )[0];
  }

  public async getById(data: VOrganizationInvitation.invitationId) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(
          and(
            eq(organization_invitations.id, data.invitationId),
            eq(organization_invitations.organizationId, data.organizationId),
          ),
        )
        .limit(1)
    )[0];
  }

  public async query(
    data: VOrganizationInvitation.organizationId & VOrganizationInvitation.query,
  ) {
    const { page = 1, limit = 10 } = data
    const _query = [eq(organization_invitations.organizationId, data.organizationId)]
    if (data.role) {
      _query.push(eq(organization_invitations.role, data.role))
    }
    if (data.search) {
      _query.push(ilike(organization_invitations.email, `%${data.search}%`))
    }
    const [invitations, totalCount] = await Promise.all([
      db.select({}).from(organization_invitations).where(and(..._query)).orderBy(desc(organization_invitations.createdAt)).limit(limit).offset((page - 1) * limit),
      db.select({ count: count() }).from(organization_invitations).where(and(..._query))
    ]);
    return {
      invitations,
      count: totalCount[0]?.count || 0
    }

  }

  public async getPendingByEmail(
    data: VOrganizationInvitation.organizationId & VAuth.email,
  ) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(
          and(
            eq(organization_invitations.organizationId, data.organizationId),
            eq(organization_invitations.email, data.email),
          ),
        )
        .limit(1)
    )[0];
  }
  public async getByTokenHash(data: VOrganizationInvitation.token) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(eq(organization_invitations.tokenHash, data.token))
        .limit(1)
    )[0];
  }
  public async accept(
    tx: NodePgDatabase,
    data: VOrganizationInvitation.invitationId,
  ) {
    return (
      await tx
        .update(organization_invitations)
        .set({
          acceptedAt: new Date(),
        })
        .where(eq(organization_invitations.id, data.invitationId))
        .returning()
    )[0];
  }

  public async delete(tx: NodePgDatabase, data: VOrganizationInvitation.invitationId) {
    return (
      await tx
        .delete(organization_invitations)
        .where(
          and(
            eq(organization_invitations.id, data.invitationId),
            eq(organization_invitations.organizationId, data.organizationId),
          ),
        )
        .returning()
    )[0];
  }
}

export default new OrganizationInvitationRepo();
