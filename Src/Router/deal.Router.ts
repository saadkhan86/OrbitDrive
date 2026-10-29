import type { FastifyInstance } from "fastify";

import dealController from "../Controller/deal.Controller";
import { dealValidator } from "../Validators/deal.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";

export const dealRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["deals"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: dealValidator.organizationId,
        body: dealValidator.create,
      },
      preHandler: authorize.role(["admin", "member", "owner"]),
    },
    dealController.create,
  );

  app.get(
    "/",
    {
      schema: {
        params: dealValidator.organizationId,
      },
      preHandler: authorize.role(["admin", "member", "owner"]),
    },
    dealController.query,
  );

  app.get(
    "/:dealId",
    {
      schema: {
        params: dealValidator.dealId,
      },
      preHandler: authorize.role(["admin", "member", "owner"]),
    },
    dealController.findById,
  );

  app.patch(
    "/:dealId",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: dealValidator.dealId,
        body: dealValidator.update,
      },
      preHandler: authorize.role(["admin", "member", "owner"]),
    },
    dealController.update,
  );

  app.delete(
    "/:dealId",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: dealValidator.dealId,
      },
      preHandler: authorize.role(["admin", "owner"]),
    },
    dealController.delete,
  );
};
