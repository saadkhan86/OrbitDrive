import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationController } from "../Controller/organization.Controller";
import { organizationMemberController } from "../Controller/organizationMember.Controller";

export const organizationMemberRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.get("/:organizationId/members", organizationMemberController.getAll);
  app.get(
    "/:organizationId/members/:organizationMemberId",
    organizationMemberController.getByUserId,
  );
  app.patch(
    "/:organizationId/members/:organizationMemberId",
    organizationMemberController.update,
  );
  app.delete(
    "/:organizationId/members/:organizationMemberId",
    organizationMemberController.remove,
  );
};
