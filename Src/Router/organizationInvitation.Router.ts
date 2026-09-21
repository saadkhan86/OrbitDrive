import { FastifyInstance } from "fastify";
import { organizationInvitationController } from "../Controller/organizationInvitation.Controller";

export const organizationInvitationRouter = (app: FastifyInstance) => {
  app.post("/:organizationId", organizationInvitationController.create);
  app.get("/:organizationId", organizationInvitationController.getAll);
  app.delete(
    "/:organizationId/:invitationId",
    organizationInvitationController.delete,
  );
  app.patch("/accept", organizationInvitationController.accept);
};
