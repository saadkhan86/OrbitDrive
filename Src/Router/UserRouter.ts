import type { FastifyInstance } from "fastify";

export async function UserRouter(app: FastifyInstance) {
  app.post("/signup", async (request, reply) => {
    return {
      message: "Signup",
    };
  });

  app.post("/login", async (request, reply) => {
    return {
      message: "Login",
    };
  });
}