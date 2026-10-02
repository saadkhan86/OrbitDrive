import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";
import { clientValidator } from "../Validators/clients.Validator";
import { clientController } from "../Controller/client.Controller";

export const clientsRouter = async (app: FastifyInstance) => {
  app.post(
    "/",
    {
      preHandler: [
        authenticate.user,
        authorize.role(["OWNER", "ADMIN", "MEMBER"]),
      ],
      schema: {
        params: clientValidator.organizationId,
        body: clientValidator.create,
      },
    },
    clientController.create,
  );

  app.get(
    "/",
    {
      preHandler: [
        authenticate.user,
        authorize.role(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
      ],
      schema: {
        params: clientValidator.organizationId,
      },
    },
    clientController.getAll,
  );

  app.get(
    "/:clientId",
    {
      preHandler: [
        authenticate.user,
        authorize.role(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
      ],
      schema: {
        params: clientValidator.clientId,
      },
    },
    clientController.getById,
  );

  app.patch(
    "/:clientId",
    {
      preHandler: [
        authenticate.user,
        authorize.role(["OWNER", "ADMIN", "MEMBER"]),
      ],
      schema: {
        params: clientValidator.clientId,
        body: clientValidator.update,
      },
    },
    clientController.update,
  );

  app.delete(
    "/:clientId",
    {
      preHandler: [authenticate.user, authorize.role(["OWNER", "ADMIN"])],
      schema: {
        params: clientValidator.clientId,
      },
    },
    clientController.delete,
  );
};
