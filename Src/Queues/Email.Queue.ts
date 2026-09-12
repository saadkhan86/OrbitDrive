import { Queue } from "bullmq";
import { RedisConfig } from "../Config/Redis.Config";
import { IEmail } from "../Interfaces/IEmail";

export const EmailQueue = new Queue<IEmail.EmailVerificationJob>("EmailQueue", {
  connection: RedisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});
