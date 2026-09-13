import { Queue } from "bullmq";
import { redisConnection } from "../Config/Redis.Config";
import { IEmail } from "../Interfaces/IEmail";

export const EmailQueue = new Queue<IEmail.EmailVerificationJob>("email", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    removeOnComplete: true,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});
