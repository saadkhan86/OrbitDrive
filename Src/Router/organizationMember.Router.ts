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
    "/",
    {
      schema: { params: organizationMemberValidator.organizationId },
      preHandler: [authorize.role(["ADMIN", "MEMBER", "OWNER", "VIEWER"])],
    },
    organizationMemberController.getAllByOrganizationId,
  );
  app.get(
    "/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role(["ADMIN", "MEMBER", "OWNER", "VIEWER"])],
    },
    organizationMemberController.getByUserId,
  );
  app.patch(
    "/:organizationMemberId",
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
    "/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role(["ADMIN", "OWNER"])],
    },
    organizationMemberController.delete,
  );
};
