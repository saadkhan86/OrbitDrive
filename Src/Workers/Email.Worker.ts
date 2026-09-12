import { Worker } from "bullmq";
import { IEmail } from "../Interfaces/IEmail";
import { sendEmailVerificationEmail } from "../Services/Email.Service";
import { RedisConfig } from "../Config/Redis.Config";

const EmailWorker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing job: ${job.name} `);
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
    connection: RedisConfig,
    concurrency: Number(process.env.EMAIL_JOB_CONCURRENCY) || 5,
  },
);
EmailWorker.on("completed", (job) => {
  console.log(`Job completed: ${job.id} with name: ${job.name}`);
}); 
EmailWorker.on("failed", (job, err) => {
  console.log(
    `Job failed: ${job?.id} with name: ${job?.name} and error: ${err.message}`,
  );
});
EmailWorker.on("error", (err) => {
  console.log(`Worker error: ${err.message}`);
});
