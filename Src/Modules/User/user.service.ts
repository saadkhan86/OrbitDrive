
import * as argon2 from "argon2";
import { VUser } from "./user.validator";
import redisCaching from "../../Caching/redis.caching";
import UserRepo from "./User.repo";
import { cleanerUtils } from "../../Utils/cleaner.utils";
import { cusrorUtils } from "../../Utils/cursot.utils";
import { decode } from "punycode";
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
  update: async (user: VUser.userId, body: VUser.update) => {
    body.password && body.password !== undefined ? body.password = await argon2.hash(body.password!) : null;
    const updatedUser = await UserRepo.update({ ...user, ...body });
    await redisCaching.delete(user.userId)
    await redisCaching.set(user.userId, updatedUser, 5 * 60)
    return updatedUser;
  },
  logout: async (user: VUser.userId) => {
    await UserRepo.logout(user)
    await redisCaching.delete(user.userId)
    return true;
  }, query: async (query: VUser.query) => {
    const decodedCursor = cusrorUtils.decode(query.cursor)
    const cursor = decodedCursor ? { createdAt: new Date(decodedCursor.createdAt), id: decodedCursor.id } : null;
    const users = await UserRepo.query({ ...query, cursor })
    const hasNextPage = users.length > query.limit
    const data = users.slice(0, query.limit)
    const lastUser = data[data.length - 1]
    const nextCursor = hasNextPage && lastUser ? cusrorUtils.encode({ createdAt: new Date(lastUser.createdAt).toISOString(), id: lastUser.id }) : null

    return { data, pagination: { limit: query.limit, hasNextPage, nextCursor } }
  }

};
