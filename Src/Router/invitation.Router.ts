import { FastifyInstance } from "fastify";
import { invitationController } from "../Controller/invitation.Controller";

export const invitationRouter = (app: FastifyInstance) => {
  app.post("/", invitationController.create);
  app.get("/", invitationController.get);
  app.delete("/:id", invitationController.delete);
  app.patch("/:invitationToken", invitationController.claim);
};
