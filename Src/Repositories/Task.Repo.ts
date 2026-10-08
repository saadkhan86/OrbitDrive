import { and, eq } from "drizzle-orm";
import { tasks } from "../Database/Schemas/tasks.Schema";
import { db } from "../Database";
import { VTask } from "../Validators/task.Validator";

class TaskRepo {
  public async create(
    data: VTask.create & {
      organizationId: string;
    },
  ) {
    const [task] = await db
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
      .returning();

    return task;
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
    data: VTask.taskId & VTask.update & VTask.organizationId,
  ) {
    const [task] = await db
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
      .returning();

    return task ?? null;
  }

  public async delete(data: VTask.taskId) {
    const [task] = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.id, data.taskId),
          eq(tasks.organizationId, data.organizationId),
        ),
      )
      .returning();

    return task ?? null;
  }
}

export default new TaskRepo();
