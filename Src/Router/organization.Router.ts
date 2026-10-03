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
        body: organizationValidator.create,
      },
    },
    organizationController.create,
  );
  app.get("/", organizationController.getAllByOwnerId);
  app.get(
    "/:organizationId",
    {
      schema: { params: organizationValidator.organizationId },
    },
    organizationController.getById,
  );
  app.patch(
    "/:organizationId",
    {
      schema: {
        body: organizationValidator.update,
        params: organizationValidator.organizationId,
      },
    },
    organizationController.update,
  );
  app.delete(
    "/:organizationId",
    {
      schema: { params: organizationValidator.organizationId },
    },
    organizationController.delete,
  );
};
