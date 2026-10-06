import { and, eq } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VOrganizationInvitation } from "../Validators/organizationInvitation.Validator";
import { VAuth } from "../Validators/auth.Validator";

class OrganizationInvitationRepo {
  public async create(data: typeof organization_invitations.$inferInsert) {
    return (
      await db
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

  public async getAllByOrganizationId(
    data: VOrganizationInvitation.organizationId,
  ) {
    return db
      .select()
      .from(organization_invitations)
      .where(eq(organization_invitations.organizationId, data.organizationId));
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

  public async delete(data: VOrganizationInvitation.invitationId) {
    return (
      await db
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
