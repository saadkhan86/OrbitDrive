import { and, desc, eq, ilike, lt, or, SQL } from "drizzle-orm";
import { VAuth } from "../Auth/auth.validator";
import { users } from "../../Database/schemas/users.Schema";
import { db } from "../../Database";
import { VUser } from "./user.validator";
import { ICursor } from "../../Interfaces/ICursor";
import { UserTypes } from "./user.types";


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

  public async update(data:
    VAuth.userId &
    Omit<VUser.update, "profile"> &
    {
      profile: Omit<VUser.update["profile"], "base64Image"> &
      UserTypes.UserProfile;
    }) {
    const newData: Partial<typeof users.$inferInsert> = {};
    if (data.fullName) newData.fullName = data.fullName;
    if (data.password) newData.passwordHash = data.password;
    if (data.profile?.avatar?.publicId) {
      newData.profile!.avatar!.publicId = data.profile.avatar.publicId
    }
    return (
      await db
        .update(users)
        .set({
          fullName: newData.fullName,
          passwordHash: newData.passwordHash,
          profile: {
            avatar: {
              url: newData.profile?.avatar?.url as string,
              publicId: newData.profile?.avatar?.publicId as string
            },
            bio: newData.profile?.bio as string
          },
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.userId))
        .returning()
    )[0];
  }
  public async update2(data: VUser.update & VAuth.userId) {
    console.log(data)
    let newData: Omit<UserTypes.UpdateUser, "password"> & { passwordHash?: string } = { userId: data.userId }
    if (data.fullName) {
      newData.fullName = data.fullName
    }
    if (data.password) {
      newData.passwordHash = data.password
    }
    if (data.profile?.avatar) {
      newData.profile!.avatar = data.profile.avatar
    }
    if (data.profile?.bio) {
      newData.profile!.bio = data.profile.bio
    }
    return (await db.update(users).set(newData).where(eq(users.id, data.userId)).returning())[0]
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
      {
        id: users.id,
        fullName: users.fullName,
        profile: users.profile,
        createdAt: users.createdAt,
      }
    )
      .from(users)
      .where(and(..._query))
      .orderBy(desc(users.createdAt), desc(users.id))
      .limit(data.limit + 1)
  }
}

export default new UserRepo();
