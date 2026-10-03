import { FastifyInstance } from "fastify";
import { organizationInvitationController } from "../Controller/organizationInvitation.Controller";
import { organizationInvitationValidator } from "../Validators/organizationInvitation.Validator";
import { authorize } from "../Hooks/authorization.Hook";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationValidator } from "../Validators/organization.Validator";

export const organizationInvitationRouter = (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.post(
    "/:organizationId",
    {
      schema: {
        params: organizationValidator.organizationId,
        body: organizationInvitationValidator.create,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationInvitationController.create,
  );
  app.get(
    "/:organizationId",
    {
      schema: {
        params: organizationInvitationValidator.organizationId,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationInvitationController.getAll,
  );
  app.delete(
    "/:organizationId/:invitationId",
    {
      schema: {
        params: organizationInvitationValidator.invitationId,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationInvitationController.delete,
  );
  app.get("/accept/:token", organizationInvitationController.accept);
};
