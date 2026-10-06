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
      schema: {
        params: dealValidator.organizationId,
        body: dealValidator.create,
      },
      preHandler: authorize.role(["ADMIN", "MEMBER", "OWNER"]),
    },
    dealController.create,
  );

  // Get All Deals
  app.get(
    "/",
    {
      schema: {
        params: dealValidator.organizationId,
      },
      preHandler: authorize.role(["ADMIN", "MEMBER", "OWNER"]),
    },
    dealController.findAll,
  );

  // Get Deal By ID
  app.get(
    "/:dealId",
    {
      schema: {
        params: dealValidator.dealId,
      },
      preHandler: authorize.role(["ADMIN", "MEMBER", "OWNER"]),
    },
    dealController.findById,
  );

  // Update Deal
  app.patch(
    "/:dealId",
    {
      schema: {
        params: dealValidator.dealId,
        body: dealValidator.update,
      },
      preHandler: authorize.role(["ADMIN", "MEMBER", "OWNER"]),
    },
    dealController.update,
  );

  // Delete Deal
  app.delete(
    "/:dealId",
    {
      schema: {
        params: dealValidator.dealId,
      },
      preHandler: authorize.role(["ADMIN", "OWNER"]),
    },
    dealController.delete,
  );
};
