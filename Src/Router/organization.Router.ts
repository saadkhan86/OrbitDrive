import { FastifyInstance } from "fastify";
import { organizationController } from "../Controller/organization.Controller";
import { organizationValidator } from "../Validators/organization.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";

export const organizationRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["organization"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        body: organizationValidator.create,
      },
    },
    organizationController.create,
  );
  app.get("/", { schema: { querystring: organizationValidator.query } }, organizationController.query);
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
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
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
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: { params: organizationValidator.organizationId },
    },
    organizationController.delete,
  );
};
