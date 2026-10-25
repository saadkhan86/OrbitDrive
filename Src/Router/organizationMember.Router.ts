import { FastifyInstance } from "fastify";
import { authenticate } from "../Hooks/AuthenticationHook";
import { organizationMemberController } from "../Controller/organizationMember.Controller";
import { organizationMemberValidator } from "../Validators/organizationMember.Validator";
import { authorize } from "../Hooks/authorization.Hook";
export const organizationMemberRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["organization Member"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.get(
    "/:organizationId",
    {
      schema: { params: organizationMemberValidator.organizationId, querystring: organizationMemberValidator.query },
      preHandler: authorize.role(),
    },
    organizationMemberController.query,
  );
  app.get(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.memberId,
      },
      preHandler: [authorize.role()],
    },
    organizationMemberController.getById,
  );
  app.patch(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.memberId,
        body: organizationMemberValidator.role,
      },
      preHandler: [authorize.role(["owner", "admin"]),authorize.manageMember()],
    },
    organizationMemberController.update,
  );
  app.delete(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.memberId,
      },
      preHandler: [authorize.role(["owner", "admin"]), authorize.manageMember()],
    },
    organizationMemberController.delete,
  );
};
