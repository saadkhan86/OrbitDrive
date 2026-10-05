import type { FastifyInstance } from "fastify";

import dealController from "../Controller/deal.Controller";
import { dealValidator } from "../Validators/deal.Validator";

export const dealRouter = async (app: FastifyInstance) => {
  // Create Deal
  app.post(
    "/organizations/:organizationId/deals",
    {
      preHandler: [app.authenticate],
      schema: {
        params: dealValidator.organizationId,
        body: dealValidator.create,
      },
    },
    dealController.create,
  );

  // Get All Deals
  app.get(
    "/organizations/:organizationId/deals",
    {
      preHandler: [app.authenticate],
      schema: {
        params: dealValidator.organizationId,
      },
    },
    dealController.findAll,
  );

  // Get Deal By ID
  app.get(
    "/organizations/:organizationId/deals/:dealId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: dealValidator.dealId,
      },
    },
    dealController.findById,
  );

  // Update Deal
  app.patch(
    "/organizations/:organizationId/deals/:dealId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: dealValidator.dealId,
        body: dealValidator.update,
      },
    },
    dealController.update,
  );

  // Delete Deal
  app.delete(
    "/organizations/:organizationId/deals/:dealId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: dealValidator.dealId,
      },
    },
    dealController.delete,
  );
};
