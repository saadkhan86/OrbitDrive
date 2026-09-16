import { FastifyInstance } from "fastify";
import { organizationController } from "../Controller/organization.Controller";
import { organizationValidator } from "../Validators/organization.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";

export const organizationRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/",
    {
      schema: {
        body: organizationValidator.createValidator,
      },
    },
    organizationController.create,
  );
  app.get("/", organizationController.getAll);
  app.get(
    "/:id",
    {
      schema: { params: organizationValidator.organizationIdValidator },
    },
    organizationController.getById,
  );
  app.patch(
    "/:id",
    {
      schema: {
        body: organizationValidator.createValidator,
        params: organizationValidator.organizationIdValidator,
      },
    },
    organizationController.update,
  );
  app.delete(
    "/:id",
    {
      schema: { params: organizationValidator.organizationIdValidator },
    },
    organizationController.delete,
  );
};
