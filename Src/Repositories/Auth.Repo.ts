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
}
export default new AuthRepo();
