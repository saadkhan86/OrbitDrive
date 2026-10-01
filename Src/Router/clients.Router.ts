import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";
import { clientValidator } from "../Validators/clients.Validator";
import { clientController } from "../Controller/client.Controller";

export default async function clientRoutes(app: FastifyInstance) {
  // Create Client
  app.post(
    "/:organizationId/clients",
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

  // Get All Clients
  app.get(
    "/:organizationId/clients",
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

  // Get Single Client
  app.get(
    "/:organizationId/clients/:clientId",
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

  // Update Client
  app.patch(
    "/:organizationId/clients/:clientId",
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

  // Delete Client
  app.delete(
    "/:organizationId/clients/:clientId",
    {
      preHandler: [authenticate.user, authorize.role(["OWNER", "ADMIN"])],
      schema: {
        params: clientValidator.clientId,
      },
    },
    clientController.delete,
  );
}
