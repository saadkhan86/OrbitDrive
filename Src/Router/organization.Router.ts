import { FastifyInstance } from "fastify";
import { organizationController } from "../Controller/organization.Controller";
import { organizationValidator } from "../Validators/organization.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
import { sharedValidator } from "../Validators/shared.Validator";

export const organizationRouter = async (app: FastifyInstance) => {
  app.post(
    "/",
    {
      schema: {
        body: organizationValidator.createValidator,
      },
      preHandler: authenticate.user,
    },
    organizationController.create,
  );
  app.get(
    "/",
    { preHandler: authenticate.user },
    organizationController.getAll,
  );
  app.get(
    "/:id",
    {
      schema: { params: sharedValidator.idValidator },
      preHandler: authenticate.user,
    },
    organizationController.getById,
  );
  app.patch(
    "/:id",
    {
      schema: {
        body: organizationValidator.createValidator,
      },
      preHandler: authenticate.user,
    },
    organizationController.update,
  );
  app.delete(
    "/:id",
    { schema: { params: idValidator } },
    organizationController.delete,
  );
};
