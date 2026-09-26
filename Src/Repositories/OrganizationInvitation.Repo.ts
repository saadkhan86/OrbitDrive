import { and, eq } from "drizzle-orm";

import { db } from "../Database";
import { organization_invitations } from "../Database/Schemas/organization_invitation.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class OrganizationInvitationRepo {
  public async create(data: typeof organization_invitations.$inferInsert) {
    const [invitation] = await db
      .insert(organization_invitations)
      .values(data)
      .returning();

    return invitation;
  }

  public async getById(organizationId: string, invitationId: string) {
    const [invitation] = await db
      .select()
      .from(organization_invitations)
      .where(
        and(
          eq(organization_invitations.id, invitationId),
          eq(organization_invitations.organizationId, organizationId),
        ),
      )
      .limit(1);

    return invitation;
  }

  public async getAllByOrganizationId(organizationId: string) {
    return db
      .select()
      .from(organization_invitations)
      .where(eq(organization_invitations.organizationId, organizationId));
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
    const [invitation] = await db
      .select()
      .from(organization_invitations)
      .where(eq(organization_invitations.tokenHash, tokenHash))
      .limit(1);

    return invitation;
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

  public async delete(organizationId: string, invitationId: string) {
    const [invitation] = await db
      .delete(organization_invitations)
      .where(
        and(
          eq(organization_invitations.id, invitationId),
          eq(organization_invitations.organizationId, organizationId),
        ),
      )
      .returning();

    return invitation;
  }
}

export default new OrganizationInvitationRepo();
