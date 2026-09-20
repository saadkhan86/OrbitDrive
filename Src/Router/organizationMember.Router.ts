import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationMemberController } from "../Controller/organizationMember.Controller";
import { organizationMemberValidator } from "../Validators/organizationMember.Validator";
import { authorize } from "../Hooks/authorization.Hook";
export const organizationMemberRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.get(
    "/:organizationId/members",
    {
      schema: { params: organizationMemberValidator.organizationId },
      preHandler: [authorize.role(["ADMIN", "MEMBER", "OWNER", "VIEWER"])],
    },
    organizationMemberController.getAllByOrganizationId,
  );
  app.get(
    "/:organizationId/members/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role(["ADMIN", "MEMBER", "OWNER", "VIEWER"])],
    },
    organizationMemberController.getByUserId,
  );
  app.patch(
    "/:organizationId/members/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
        body: organizationMemberValidator.role,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationMemberController.update,
  );
  app.delete(
    "/:organizationId/members/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationMemberController.delete,
  );
};
