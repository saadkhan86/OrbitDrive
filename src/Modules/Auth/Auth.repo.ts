import { and, eq } from "drizzle-orm";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { VAuth } from "./auth.validator";

class AuthRepo {
  public async create(data: typeof users.$inferInsert) {
    return (
      await db
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
        })
    )[0];
  }
  public async findByEmail(data: VAuth.email) {
    return (
      await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    )[0];
  }

  public async findById(user: VAuth.userId) {
    const foundUser = (await db.select().from(users).where(eq(users.id, user.userId)).limit(1))[0]
    return foundUser
  }

  public async updateIsEmailVerified(data: VAuth.userId) {
    return (
      await db
        .update(users)
        .set({ isEmailVerified: true })
        .where(and(eq(users.id, data.userId), eq(users.isEmailVerified, false)))
        .returning({ isEmailVerified: users.isEmailVerified })
    )[0]?.isEmailVerified;
  }
  public async updateRefreshToken(data: VAuth.refreshToken & VAuth.userId) {
    return (
      await db
        .update(users)
        .set({ refreshToken: data.refreshToken })
        .where(eq(users.id, data.userId))
        .returning()
    )[0];
  }
  public async findByRefreshToken(data: VAuth.refreshToken) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, data.refreshToken));
    return user ? user[0] : null;
  }
}
export default new AuthRepo();
