
import * as argon2 from "argon2";
import { VUser } from "./user.validator";
import redisCaching from "../../Caching/redis.caching";
import UserRepo from "./User.repo";
import { cleanerUtils } from "../../Utils/cleaner.utils";
export const userService = {
  me: async (user: VUser.userId) => {
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
  update: async (user: VUser.userId, data: VUser.update) => {
    let newData: Record<string, string> = {};
    if (data.password && data.password !== undefined)
      newData.password = await argon2.hash(data.password!);
    if (data.fullName && data.fullName !== undefined)
      newData.fullName = data.fullName;
    if (data.profile && data.profile !== undefined)
      newData.profile = data.profile
    const updatedUser = await UserRepo.update({ userId: user.userId, ...newData });
    await redisCaching.delete(user.userId)
    await redisCaching.set(user.userId, updatedUser, 5 * 60)
    return updatedUser;
  },
  logout: async (user: VUser.userId) => {
    await UserRepo.logout(user)
    await redisCaching.delete(user.userId)
    return true;
  }, query: async (query: VUser.query) => {
    const users = await UserRepo.query(query)
    return users;
  }

};
