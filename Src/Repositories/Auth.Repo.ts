import { and, eq } from "drizzle-orm";
import { db } from "../Database";
import { users } from "../Database/Schemas/users.Schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

class AuthRepo {
  public async signup(
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

  public async updateIsEmailVerified(tx: NodePgDatabase<any>, id: string) {
    const user = await tx
      .update(users)
      .set({ isEmailVerified: true })
      .where(and(eq(users.id, id), eq(users.isEmailVerified, false)))
      .returning({ isEmailVerified: users.isEmailVerified });
    return user[0]?.isEmailVerified;
  }
  public async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await db
      .update(users)
      .set({ refreshToken: refreshToken })
      .where(eq(users.id, userId))
      .returning();
    return user[0];
  }
  public async findByRefreshToken(token: string) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, token));
    return user ? user[0] : null;
  }
}
export default new AuthRepo();
