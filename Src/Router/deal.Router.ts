import type { FastifyInstance } from "fastify";

import dealController from "../Controller/deal.Controller";
import { dealValidator } from "../Validators/deal.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";

export const dealRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/",
    {
      schema: {
        params: dealValidator.organizationId,
        body: dealValidator.create,
      },
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
    },
    dealController.delete,
  );
};
