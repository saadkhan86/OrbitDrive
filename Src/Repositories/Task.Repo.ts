import { and, count, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";
import { tasks } from "../Database/Schemas/tasks.Schema";
import { db } from "../Database";
import { VTask } from "../Validators/task.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { clients } from "../Database/Schemas/clients.Schema";
import { deals } from "../Database/Schemas/deals.Schema";

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
    const task = (await db
      .select({
        ...getTableColumns(tasks),
        client: { name: clients.name },
        deal: { title: deals.title }
      })
      .from(tasks)
      .leftJoin(clients, eq(tasks.clientId, clients.id))
      .leftJoin(deals, eq(tasks.dealId, deals.id))
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .limit(1))[0]

    return task ?? null;
  }

  public async query(data: VTask.organizationId & VTask.query) {
    const { page = 1, limit = 10 } = data;
    const _query: any[] = [eq(tasks.organizationId, data.organizationId)]

    if (data.status) _query.push(eq(tasks.status, data.status))
    if (data.priority) _query.push(eq(tasks.priority, data.priority))
    if (data.search) {
      _query.push(
        or(
          ilike(tasks.title, `%${data.search}%`),
          ilike(tasks.description, `%${data.search}%`),
        ),
      )
    }
    const [foundTasks, total] = await Promise.all([
      db
        .select()
        .from(tasks)
        .where(and(..._query)).orderBy(desc(tasks.createdAt)).limit(limit).offset((page - 1) * limit),

      db
        .select({ count: count() })
        .from(tasks)
        .where(and(..._query)),
    ])
    return { tasks: foundTasks, total: total[0]?.count ?? 0 };
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
      .returning())[0] ?? null
  }
}

export default new TaskRepo();
