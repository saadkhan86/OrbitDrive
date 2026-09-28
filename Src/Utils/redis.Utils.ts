import { redis } from "../Config/Redis.Config";
import { Constants } from "../Constants/Constants";
import { EmailJobName } from "../Types/emailJob";

export const redisUtils = {
  setRedis: async (type: EmailJobName, token: string, userId: string) => {
    return await redis.set(
      `${type}:${token}`,
      userId,
      "EX",
      Constants.tokenExpireTime * 60,
    );
  },
  getRedis: async (
    type: EmailJobName,
    token: string,
  ): Promise<string | null> => {
    return await redis.get(`${type}:${token}`);
  },
  deleteRedis: async (type: EmailJobName, token: string) => {
    return await redis.del(`${type}:${token}`);
  },
};
