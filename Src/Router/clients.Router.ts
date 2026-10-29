import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";
import { clientValidator } from "../Validators/clients.Validator";
import { clientController } from "../Controller/client.Controller";

export const clientsRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["clients"] };
  });

  app.addHook("preHandler", authenticate.user);
  app.post(
    "/",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin", "member"])],
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
      preHandler: [authorize.role()],
      schema: {
        params: clientValidator.organizationId,
        querystring: clientValidator.query
      },
    },
    clientController.query,
  );

  app.get(
    "/:clientId",
    {
      preHandler: [authorize.role()],
      schema: {
        params: clientValidator.clientId,
      },
    },
    clientController.getById,
  );

  app.patch(
    "/:clientId",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin", "member"])],
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

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      preHandler: [authorize.role(["owner", "admin"])],
      schema: {
        params: clientValidator.clientId,
      },
    },
    clientController.delete,
  );
};
