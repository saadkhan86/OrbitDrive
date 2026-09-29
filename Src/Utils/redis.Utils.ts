import { redis } from "../Config/Redis.Config";
import { Constants } from "../Constants/Constants";
import { EmailJobName } from "../Types/emailJob";

export const redisUtils = {
  setRedis: async (type: EmailJobName, key: string, userId: string) => {
    return await redis.set(
      `${type}:${key}`,
      userId,
      "EX",
      Constants.tokenExpireTime * 60,
    );
  },
  getRedis: async (type: EmailJobName, key: string): Promise<string | null> => {
    return await redis.get(`${type}:${key}`);
  },
  deleteRedis: async (type: EmailJobName, key: string) => {
    return await redis.del(`${type}:${key}`);
  },
};
