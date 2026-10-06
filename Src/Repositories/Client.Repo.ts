import { and, eq } from "drizzle-orm";

import { db } from "../Database";

import { clients } from "../Database/Schemas/clients.Schema";
import { VClient } from "../Validators/clients.Validator";

class ClientRepo {
  // Create Client
  public async create(data: typeof clients.$inferInsert) {
    return (
      await db
        .insert(clients)
        .values({
          organizationId: data.organizationId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          status: data.status || "active",
          notes: data.notes,
        })
        .returning()
    )[0];
  }

  // Get All Clients
  public async getAll(organizationId: string) {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, organizationId));
  }

  // Get Single Client
  public async getById(data: VClient.ClientIdParams) {
    return (
      await db
        .select()
        .from(clients)
        .where(
          and(
            eq(clients.id, data.clientId),
            eq(clients.organizationId, data.organizationId),
          ),
        )
    )[0];
  }

  // Update Client
  public async update(
    organizationId: string,
    clientId: string,
    data: VClient.UpdateClientInput,
  ) {
    return (
      await db
        .update(clients)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(clients.id, clientId),
            eq(clients.organizationId, organizationId),
          ),
        )
        .returning()
    )[0];
  }

  public async delete(organizationId: string, clientId: string) {
    return (
      await db
        .delete(clients)
        .where(
          and(
            eq(clients.id, clientId),
            eq(clients.organizationId, organizationId),
          ),
        )
        .returning()
    )[0];
  }
}

export default new ClientRepo();
