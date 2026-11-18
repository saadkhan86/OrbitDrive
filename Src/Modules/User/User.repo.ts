import { and, desc, eq, ilike, lt, or, SQL } from "drizzle-orm";
import { VAuth } from "../Auth/auth.validator";
import { users } from "../../Database/schemas/users.Schema";
import { db } from "../../Database";
import { VUser } from "./user.validator";
import { ICursor } from "../../Interfaces/ICursor";
import userRefColumns from "./user.reference";


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

  public async update(data: VUser.update & VAuth.userId) {
    let newData: any = {}
    if (data.fullName) {
      newData.fullName = data.fullName
    }
    if (data.profile?.avatar) {
      newData.profile.avatar = data.profile.avatar
    }
    if (data.profile?.bio) {
      newData.profile.bio = data.profile.bio
    }
    if (data.password) {
      newData.passwordHash = data.password
    }
    return (
      await db
        .update(users)
        .set({
          ...newData,
          updatedAt: new Date()
        })
        .where(eq(users.id, data.userId))
        .returning()
    )[0]
  }
  public async logout(data: VUser.userId) {
    await db.update(users).set({ refreshToken: null }).where(eq(users.id, data.userId));
    return true;
  }
  public async query(data: Omit<VUser.query, "cursor"> & ICursor.query) {
    const _query: SQL[] = []
    if (data.userId) _query.push(eq(users.id, data.userId))
    if (data.search) _query.push(
      or(
        ilike(users.fullName, `%${data.search}%`),
        ilike(users.email, `%${data.search}%`)
      ) as SQL
    )
    if (data.cursor) {
      _query.push(
        or(
          lt(users.createdAt, data.cursor.createdAt),
          and(
            lt(users.id, data.cursor.id),
            eq(users.createdAt, data.cursor.createdAt)
          )
        )! as SQL
      )
    }
    return await db.select(
      userRefColumns
    )
      .from(users)
      .where(and(..._query))
      .orderBy(desc(users.createdAt), desc(users.id))
      .limit(data.limit + 1)
  }
}

export default new UserRepo();
