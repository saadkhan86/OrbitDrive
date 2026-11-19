import { and, count, desc, eq, ilike, lt, or, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { VTask } from "./task.validator";
import { tasks } from "../../Database/schemas/tasks.Schema";
import { db } from "../../Database";
import { clients } from "../../Database/schemas/clients.Schema";
import { deals } from "../../Database/schemas/deals.Schema";
import { users } from "../../Database/schemas/users.Schema";
import { ICursor } from "../../Interfaces/ICursor";
import userRefColumns from "../User/user.reference";
import clientRefColumns from "../Client/client.refrence";
import dealRefColumns from "../Deal/deal.refrence";
import taskRefColumns from "./task.refrence";

class TaskRepo {
  public async create(
    tx: NodePgDatabase,
    data: VTask.create & {
      organizationId: string;
    },
  ) {
    return (await tx
      .insert(tasks)
      .values({
        organizationId: data.organizationId,
        clientId: data.clientId,
        dealId: data.dealId,
        assignedTo: data.assignedTo,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
      })
      .returning())[0];

  }
  public async findById(data: VTask.taskId) {
    return (await db
      .select({
        ...taskRefColumns,
        assignedTo: { ...userRefColumns },
        client: { ...clientRefColumns },
        deal: { ...dealRefColumns }
      })
      .from(tasks)
      .leftJoin(clients, eq(tasks.clientId, clients.id))
      .leftJoin(deals, eq(tasks.dealId, deals.id))
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .limit(1))[0]

  }
  public async query(data: VTask.organizationId & Omit<VTask.query, "cursor"> & ICursor.query) {
    const { cursor, limit = 10 } = data;
    const _query: SQL[] = [eq(tasks.organizationId, data.organizationId)]

    if (data.status) _query.push(eq(tasks.status, data.status))
    if (data.priority) _query.push(eq(tasks.priority, data.priority))
    if (data.search) {
      _query.push(
        or(
          ilike(tasks.title, `%${data.search}%`),
          ilike(tasks.description, `%${data.search}%`),
        ) as SQL,
      )
    }
    if (cursor) {
      _query.push(or
        (
          lt(tasks.createdAt, cursor.createdAt),
          and(
            eq(tasks.createdAt, cursor.createdAt),
            lt(tasks.id, cursor.id))
        )!
      )
    }
    return await
      db
        .select()
        .from(tasks)
        .where(and(..._query))
        .orderBy(
          desc(tasks.createdAt),
          desc(tasks.id)
        )
        .limit(limit + 1)
  }
  public async update(
    tx: NodePgDatabase,
    data: VTask.taskId & VTask.update & VTask.organizationId,
  ) {
    return (await tx
      .update(tasks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .returning())[0] ?? null;

  }
  public async delete(tx: NodePgDatabase, data: VTask.taskId) {
    return (await tx
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .returning())[0]
  }
}

export default new TaskRepo();
