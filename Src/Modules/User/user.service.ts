
import * as argon2 from "argon2";
import { VUser } from "./user.validator";
import redisCaching from "../../Caching/redis.caching";
import UserRepo from "./User.repo";
import { cleanerUtils } from "../../Utils/cleaner.utils";
import { cusrorUtils } from "../../Utils/cursot.utils";
import { IReply } from "../../Interfaces/IReply";
import { uploaderUtils } from "../../Utils/uploader.utils";
import { UserTypes } from "./user.types";
import { CustomError } from "../../ErrorHandler/CustomError";
import { cloudinaryService } from "../../Services/cloudinary.utils";
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
    if (body.password) {
      body.password = await argon2.hash(body.password)
    }
    if (body.profile?.avatar?.publicId) {
      try {
        await cloudinaryService.delete(body.profile.avatar.publicId)
      } catch (error) {
        console.log("profile avatar deletion failed")
      }
    }
    if (body.profile?.avatar?.url) {
      // const uploaded = await uploaderUtils.convertToUrl(user.userId, body.profile.avatar.url)
      // if (typeof uploaded == "object") {
      //   body.profile.avatar.url = uploaded?.url as string
      //   body.profile.avatar.publicId = uploaded?.publicId as string
      // } else if (typeof uploaded == "string") {
      //   body.profile.avatar.url = uploaded
      // } else {
      //   throw new CustomError(500, "profile upload failed", "SERVER_ERROR")
      // }
      body.profile.avatar.publicId="123"
      body.profile.avatar.url="hhhsdhfhsd"
    }
    if (body.profile?.bio) {
      body.profile.bio = body.profile.bio
    }
    const updatedUser = await UserRepo.update2({ ...body, userId: user.userId })
    await redisCaching.delete(user.userId)
    await redisCaching.set(user.userId, updatedUser, 5 * 60)
    return updatedUser;
  },
  logout: async (user: VUser.userId) => {
    await UserRepo.logout(user)
    await redisCaching.delete(user.userId)
    return true;
  },
  query: async (query: VUser.query): Promise<IReply.queryReturn> => {
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
