import { users } from "../Database/Schemas/users.Schema";
import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { UpdateValidator } from "../Validators/UserValidator";
import { email } from "zod";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
class UserRepo {
  public async findByEmail(email: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0];
  }
  public async findById(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user[0];
  }
  public async create(
    tx: any,
    data: {
      fullName: string;
      email: string;
      passwordHash: string;
    },
  ) {
    const result = await db
      .insert(users)
      .values({
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        isEmailVerified: users.isEmailVerified,
        createdAt: users.createdAt,
      });
    return result[0];
  }
  public async update(id: string, data: UpdateValidator) {
    const user = await db
      .update(users)
      .set({ fullName: data.fullName })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        updatedAt: users.updatedAt,
      });
    return user[0];
  }
  public async updatedIsEmailVerified(tx: NodePgDatabase<any>, id: string) {
    const user = await tx
      .update(users)
      .set({ isEmailVerified: true })
      .where(and(eq(users.id, id), eq(users.isEmailVerified, false)))
      .returning({ isEmailVerified: users.isEmailVerified });
    return user[0]?.isEmailVerified;
  }
}

export default new UserRepo();
