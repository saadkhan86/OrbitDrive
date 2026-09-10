import { User } from "../Database/Schemas/User.Schema";
import { eq } from "drizzle-orm";
import { db } from "../Database";
class UserRepo {
  public async findByEmail(email: string) {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    console.log(db, user);
    return user[0];
  }
  public async create(data: {
    fullName: string;
    email: string;
    passwordHash: string;
  }) {
    const result = await db
      .insert(User)
      .values({
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
      })
      .returning({
        id: User.id,
        fullName: User.fullName,
        email: User.email,
        isEmailVerified: User.isEmailVerified,
        createdAt: User.createdAt,
      });
    return result[0];
  }
}

export default new UserRepo();
