import { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { organizationValidator } from "../Organization/organization.validator";
import { organizationInvitationValidator } from "./organizationInvitation.validator";
import { organizationInvitationController } from "./organizationInvitation.controller";
import { authorize } from "../../Hooks/authorization.hook";

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
        params: organizationInvitationValidator.organizationId,
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
  app.patch("/accept/:token", { schema: { params: organizationInvitationValidator.accept } }, organizationInvitationController.accept);
};
