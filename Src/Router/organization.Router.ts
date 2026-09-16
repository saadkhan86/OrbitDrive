import { FastifyInstance } from "fastify";
import { organizationController } from "../Controller/organization.Controller";

export const organizationRouter = async (app: FastifyInstance) => {
  app.post("/", organizationController.create);
  app.get("/", organizationController.getAll);
  app.get("/:id", organizationController.getById);
  app.patch("/:id", organizationController.update);
  app.delete("/:id", organizationController.delete);
};
