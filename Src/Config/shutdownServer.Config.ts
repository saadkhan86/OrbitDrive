import { FastifyInstance } from "fastify";
import { EmailWorker } from "../Workers/Email.Worker";

export const shutdownServer = async (
  server: FastifyInstance,
  signal: string,
) => {
  server.log.info(`Received ${signal}. Shutting down gracefully...`);
  try {
    await EmailWorker.close();
    await server.close();
  } catch (err) {
    server.log.error(err);
  } finally {
    process.exit(0);
  }
};
