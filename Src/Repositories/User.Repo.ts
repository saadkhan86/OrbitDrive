import { users } from "../Database/Schemas/users.Schema";
import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { updateValidator } from "../Validators/user.Validator";

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

  public async update(id: string, data: Partial<updateValidator>) {
    const newData: Partial<updateValidator> = {};
    if (data.fullName) newData.fullName = data.fullName;
    if (data.passwordHash) newData.passwordHash = data.passwordHash;
    const user = await db
      .update(users)
      .set(newData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        updatedAt: users.updatedAt,
      });
    return user[0];
  }
}

export default new UserRepo();
