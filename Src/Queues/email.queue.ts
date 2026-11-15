import { Queue } from "bullmq";
import type { EmailJobData, EmailJobName } from "../Types/emailJob.js";
import { redisConnection } from "../Config/redis.config.js";
export const EmailQueue = new Queue("email", {
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

export async function addEmailJob<K extends EmailJobName>(
  name: K,
  data: EmailJobData[K],
) {
  return EmailQueue.add(name, data);
}
