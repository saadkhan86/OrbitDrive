import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationMemberController } from "../Controller/organizationMember.Controller";
import { organizationMemberValidator } from "../Validators/organizationMember.Validator";
export const organizationMemberRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.get(
    "/:organizationId/members",
    {
      schema: { params: organizationMemberValidator.organizationId },
    },
    organizationMemberController.getAllByOwnerId,
  );
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
