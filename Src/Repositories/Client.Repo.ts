import { and, eq } from "drizzle-orm";

import { db } from "../Database";

import { clients } from "../Database/Schemas/clients.Schema";
import { VClient } from "../Validators/clients.Validator";

class ClientRepo {
  // Create Client
  public async create(data: typeof clients.$inferInsert) {
    return (await db.insert(clients).values(data).returning())[0];
  }

  // Get All Clients
  public async getAll(data: VClient.OrganizationIdParams) {
    return await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, data.organizationId));
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
    data: VClient.UpdateClientInput & VClient.ClientIdParams,
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
            eq(clients.id, data.clientId),
            eq(clients.organizationId, data.organizationId),
          ),
        )
        .returning()
    )[0];
  }

  public async delete(data: VClient.ClientIdParams) {
    return (
      await db
        .delete(clients)
        .where(
          and(
            eq(clients.id, data.clientId),
            eq(clients.organizationId, data.organizationId),
          ),
        )
        .returning()
    )[0];
  }
}

export default new ClientRepo();
