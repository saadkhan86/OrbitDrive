import { FastifyInstance } from "fastify";
import { clientController } from "../Controller/client.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";

export const clientsRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.post("/", clientController.create);
  app.get("/", clientController.getAll);
  app.get("/:clientId", clientController.getById);
  app.patch("/:clientId", clientController.update);
  app.delete("/:clientId", clientController.delete);
};
