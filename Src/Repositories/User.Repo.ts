import { users } from "../Database/Schemas/users.Schema";
import { eq } from "drizzle-orm";
import { db } from "../Database";
import { VAuth } from "../Validators/auth.Validator";

class UserRepo {
  public async findByEmail(data: VAuth.email) {
    return (
      await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    )[0];
  }

  public async findById(user: VAuth.userId) {
    return (
      await db.select().from(users).where(eq(users.id, user.userId)).limit(1)
    )[0];
  }

  public async update(data: VAuth.userId & VAuth.update) {
    const newData: Partial<typeof users.$inferInsert> = {};
    if (data.fullName) newData.fullName = data.fullName;
    if (data.password) newData.passwordHash = data.password;
    return (
      await db
        .update(users)
        .set({
          ...newData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.userId))
        .returning({
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          updatedAt: users.updatedAt,
        })
    )[0];
  }
  public async logout(data: VAuth.userId) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, data.userId));
    return true;
  }
}

export default new UserRepo();
