import { FastifyInstance } from "fastify";
import { organizationInvitationController } from "../Controller/organizationInvitation.Controller";
import { organizationInvitationValidator } from "../Validators/organizationInvitation.Validator";
import { authorize } from "../Hooks/authorization.Hook";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationValidator } from "../Validators/organization.Validator";

export const organizationInvitationRouter = (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["organization Invitation"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/:organizationId",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: organizationValidator.organizationId,
        body: organizationInvitationValidator.create,
      },
      preHandler: [authorize.role(["admin", "owner"])],
    },
    organizationInvitationController.create,
  );
  app.get(
    "/:organizationId",
    {
      schema: {
        params: organizationInvitationValidator.organizationId,
        querystring: organizationInvitationValidator.query
      },
      preHandler: [authorize.role(["admin", "owner"])],
    },
    organizationInvitationController.query,
  );
  app.get("/:organizationId/:invitationId", {
    schema: {
      params: organizationInvitationValidator.invitationId,
    },
    preHandler: [authorize.role(["admin", "owner"])],
  }, organizationInvitationController.getById)
  app.delete(
    "/:organizationId/:invitationId",
    {

      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: organizationInvitationValidator.invitationId,
      },
      preHandler: [authorize.role(["admin", "owner"])],
    },
    organizationInvitationController.delete,
  );
  app.patch("/accept/:token", organizationInvitationController.accept);
};
