import { and, eq } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  OrganizationInvitationDeleteInput,
  OrganizationInvitationOrganizationIdInput,
} from "../Validators/organizationInvitation.Validator";
import { UserIdInputValidator } from "../Validators/auth.Validator";

class OrganizationInvitationRepo {
  public async create(data: typeof organization_invitations.$inferInsert) {
    return (
      await db
        .insert(organization_invitations)
        .values({ ...data, acceptedAt: null })
        .returning()
    )[0];
  }

  public async getById(org: OrganizationInvitationDeleteInput) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(
          and(
            eq(organization_invitations.id, org.invitationId),
            eq(organization_invitations.organizationId, org.organizationId),
          ),
        )
        .limit(1)
    )[0];
  }

  public async getAllByOrganizationId(
    org: OrganizationInvitationOrganizationIdInput,
  ) {
    return db
      .select()
      .from(organization_invitations)
      .where(eq(organization_invitations.organizationId, org.organizationId));
  }

  public async getPendingByEmail(organizationId: string, email: string) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(
          and(
            eq(organization_invitations.organizationId, organizationId),
            eq(organization_invitations.email, email),
          ),
        )
        .limit(1)
    )[0];
  }
  public async getByTokenHash(tokenHash: string) {
    return (
      await db
        .select()
        .from(organization_invitations)
        .where(eq(organization_invitations.tokenHash, tokenHash))
        .limit(1)
    )[0];
  }
  public async accept(tx: NodePgDatabase, invitationId: string) {
    return (
      await tx
        .update(organization_invitations)
        .set({
          acceptedAt: new Date(),
        })
        .where(eq(organization_invitations.id, invitationId))
        .returning()
    )[0];
  }

  public async delete(org: OrganizationInvitationDeleteInput) {
    return (
      await db
        .delete(organization_invitations)
        .where(
          and(
            eq(organization_invitations.id, org.invitationId),
            eq(organization_invitations.organizationId, org.organizationId),
          ),
        )
        .returning()
    )[0];
  }
}

export default new OrganizationInvitationRepo();
