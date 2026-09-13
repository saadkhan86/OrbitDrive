import { Worker } from "bullmq";
import { IEmail } from "../Interfaces/IEmail";
import { sendEmailVerificationEmail } from "../Services/Email.Service";
import { redisConnection } from "../Config/Redis.Config";
import { EmailQueue } from "../Queues/Email.Queue";

export const EmailWorker = new Worker(
  "email",
  async (job) => {
    console.log(
      `⏳ [RUNNING] Job ID: ${job.id} | Name: ${job.name} started processing`,
    );
    const data: IEmail.EmailVerificationJob = job.data;
    switch (job.name) {
      case "verify-email":
        await sendEmailVerificationEmail(
          data.email,
          data.verificationToken,
          data.expiresIn,
          data.fullName,
        );
        break;
      default:
        console.log(`Invalid job name: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: Number(process.env.EMAIL_JOB_CONCURRENCY) || 5,
    lockDuration: 60000,
    maxStalledCount: 2,
    stalledInterval: 30000,
  },
);

EmailWorker.on("completed", async (job) => {
  const durationMs =
    (job.finishedOn || Date.now()) - (job.processedOn || job.timestamp);
  const durationStr =
    durationMs < 1000
      ? `${durationMs}ms`
      : `${(durationMs / 1000).toFixed(2)}s`;

  console.log(
    `✅ [COMPLETED] Job ID: ${job.id} | Name: ${job.name} | Completed in: ${durationStr}`,
  );

  try {
    await job.remove();
  } catch {
    // Ignore if already removed by removeOnComplete
  }

  const counts = await EmailQueue.getJobCounts("active", "waiting", "delayed");
  if (counts.active === 0 && counts.waiting === 0 && counts.delayed === 0) {
    console.log("🎉 All jobs completed and Redis queue is clear!");
  }
});

EmailWorker.on("failed", async (job, err) => {
  const durationMs =
    Date.now() - (job?.processedOn || job?.timestamp || Date.now());
  const durationStr =
    durationMs < 1000
      ? `${durationMs}ms`
      : `${(durationMs / 1000).toFixed(2)}s`;

  console.log(
    `❌ [FAILED] Job ID: ${job?.id} | Name: ${job?.name} | Failed after: ${durationStr} | Error: ${err.message}`,
  );

  const counts = await EmailQueue.getJobCounts("active", "waiting", "delayed");
  if (counts.active === 0 && counts.waiting === 0 && counts.delayed === 0) {
    console.log("🎉 All jobs processed and Redis queue is clear!");
  }
});

EmailWorker.on("error", (err) => {
  console.log(`Worker error: ${err.message}`);
});
