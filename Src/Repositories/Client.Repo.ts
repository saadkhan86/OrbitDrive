import { and, asc, count, desc, eq, ilike, or, SQL } from "drizzle-orm";

import { db } from "../Database";

import { clients } from "../Database/Schemas/clients.Schema";
import { VClient } from "../Validators/clients.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class ClientRepo {
  // Create Client
  public async create(tx: NodePgDatabase, data: typeof clients.$inferInsert) {
    return (await tx.insert(clients).values(data).returning())[0];
  }

  // Get All Clients
  public async query(data: VClient.OrganizationIdParams & VClient.query) {
    const { page = 1, limit = 5 } = data;
    const _query: any[] = [eq(clients.organizationId, data.organizationId)];
    if (data.status) {
      _query.push(eq(clients.status, data.status))
    }
    if (data.search) {
      _query.push(or(ilike(clients.name, `%${data.search}%`), ilike(clients.email, `%${data.search}%`), ilike(clients.phone, `%${data.search}%`), ilike(clients.company, `%${data.search}%`)))
    }
    const [foundClients, total] = await Promise.all([
      db.select().from(clients).where(and(..._query)).offset((page - 1) * limit).limit(limit).orderBy(desc(clients.createdAt)),
      db.select({ count: count() }).from(clients).where(and(..._query))
    ])
    return { clients: foundClients, count: total[0]?.count ?? 0 }
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
    tx: NodePgDatabase,
    data: VClient.UpdateClientInput & VClient.ClientIdParams,
  ) {
    return (
      await tx
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

  public async delete(tx: NodePgDatabase, data: VClient.ClientIdParams) {
    return (
      await tx
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
