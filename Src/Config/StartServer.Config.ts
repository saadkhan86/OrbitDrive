import { FastifyInstance } from "fastify";
import { checkDatabaseConnection } from "../Database";

export const StartServer = async (app: FastifyInstance) => {
  await checkDatabaseConnection();

  try {
    const port = await app.listen({ port: 8080 });
    console.log(`🚀 Server running on ${port}`);
  } catch (error: any) {
    console.log("Server crashed due to Error " + error);
    process.exit(1);
  }
};
