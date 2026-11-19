import { and, count, desc, eq, ilike, or, SQL } from "drizzle-orm";

import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { clients } from "../../Database/schemas/clients.Schema";
import { VClient } from "./client.validator";
import { db } from "../../Database";
import clientRefColumns from "./client.refrence";

class ClientRepo {
  public async create(tx: NodePgDatabase, data: typeof clients.$inferInsert) {
    return (await tx.insert(clients).values({
      organizationId: data.organizationId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      status: data.status,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning())[0];
  }
  public async query(data: VClient.organizationId & VClient.query) {
    const { page, limit } = data;
    const _query: SQL[] = [eq(clients.organizationId, data.organizationId)];
    if (data.status) {
      _query.push(eq(clients.status, data.status))
    }
    if (data.search) {
      const searchPattern = `%${data.search}%`;
      _query.push(
        or(
          ilike(clients.name, searchPattern),
          ilike(clients.email, searchPattern),
          ilike(clients.phone, searchPattern),
          ilike(clients.company, searchPattern)
        ) as SQL
      )
    }
    const [foundClients, total] = await Promise.all([
      db
        .select()
        .from(clients)
        .where(and(..._query))
        .orderBy(desc(clients.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: count() })
        .from(clients)
        .where(and(..._query))
    ])
    return { clients: foundClients, count: total[0]?.count ?? 0 }
  }
  public async getById(data: VClient.clientId) {
    return (
      await db
        .select({
          ...clientRefColumns,
        })
        .from(clients)
        .where(
          and(
            eq(clients.id, data.clientId),
            eq(clients.organizationId, data.organizationId),
          ),
        )
    )[0];
  }
  public async update(
    tx: NodePgDatabase,
    data: VClient.update & VClient.clientId,
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
  public async delete(tx: NodePgDatabase, data: VClient.clientId) {
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
