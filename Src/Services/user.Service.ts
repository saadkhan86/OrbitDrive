import UserRepo from "../Repositories/User.Repo";
import { VAuth } from "../Validators/auth.Validator";
import * as argon2 from "argon2";
import { VUser } from "../Validators/user.Validator";
import redisCaching from "../Infrastructure/Caching/redis.Caching";
import { cleanerUtils } from "../Utils/cleaner.Utils";
export const userService = {
  me: async (user: VAuth.userId) => {
    let foundUser = await redisCaching.get(user.userId)
    if (!foundUser) {
      foundUser = await UserRepo.findById({ userId: user.userId });
      foundUser = cleanerUtils.user(foundUser as any);
      if (foundUser) {
        await redisCaching.set(user.userId, foundUser, 5 * 60)
      }
    }
    return foundUser;
  },
  update: async (user: VAuth.userId, data: VAuth.update) => {
    let newData: Record<string, string> = {};
    if (data.password && data.password !== undefined)
      newData.password = await argon2.hash(data.password!);
    if (data.fullName && data.fullName !== undefined)
      newData.fullName = data.fullName;
    const updatedUser = await UserRepo.update({ userId: user.userId, ...newData });
    await redisCaching.delete(user.userId)
    await redisCaching.set(user.userId, updatedUser, 5 * 60)
    return updatedUser;
  },
  logout: async (user: VAuth.userId) => {
    await UserRepo.logout(user)
    await redisCaching.delete(user.userId)
    return true;
  }, query: async (query: VUser.query) => {
    const users = await UserRepo.query(query)
    return users;
  }

};
