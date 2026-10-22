import { and, eq } from "drizzle-orm";
import { tasks } from "../Database/Schemas/tasks.Schema";
import { db } from "../Database";
import { VTask } from "../Validators/task.Validator";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

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
    const [task] = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .limit(1);

    return task ?? null;
  }

  public async getAll(data: VTask.organizationId) {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.organizationId, data.organizationId));
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
