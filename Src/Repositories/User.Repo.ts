import { users } from "../Database/Schemas/users.Schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../Database";
import { VAuth } from "../Validators/auth.Validator";
import { VUser } from "../Validators/user.Validator";

class UserRepo {
  public async findByEmail(data: VAuth.email) {
    return (
      await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    )[0];
  }

  public async findById(user: VAuth.userId) {
    const foundUser = (await db.select().from(users).where(eq(users.id, user.userId)).limit(1))[0]
    return foundUser
  }

  public async update(data: VAuth.userId & VAuth.update) {
    const newData: Partial<typeof users.$inferInsert> = {};
    console.log(data)
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
  public async query(data: VUser.query) {
    const { page = 1, limit = 5 } = data
    const _query = []
    if (data.userId) _query.push(eq(users.id, data.userId))
    if (data.search) _query.push(or(ilike(users.fullName, `%${data.search}%`), ilike(users.email, `%${data.search}%`)))
    const [foundUsers, total] = await Promise.all([
      db.select({ id: users.id, fullName: users.fullName, email: users.email }).from(users).where(and(..._query)).orderBy(desc(users.createdAt)).offset((page - 1) * limit).limit(limit),
      db.select({ count: count() }).from(users).where(and(..._query))])
    return { users: foundUsers, count: total[0]?.count ?? 0 }
  }
}

export default new UserRepo();
