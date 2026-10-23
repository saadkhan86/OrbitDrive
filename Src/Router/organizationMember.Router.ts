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
  app.get("/", {
    schema: {
      querystring: organizationMemberValidator.query,
    }
  }, organizationMemberController.query)
  app.get(
    "/:organizationId",
    {
      schema: { params: organizationMemberValidator.organizationId },
      preHandler: authorize.role(),
    },
    organizationMemberController.getAllByOrganizationId,
  );
  app.get(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role()],
    },
    organizationMemberController.getByUserId,
  );
  app.patch(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
        body: organizationMemberValidator.role,
      },
      preHandler: [authorize.role()],
    },
    organizationMemberController.update,
  );
  app.delete(
    "/:organizationId/:organizationMemberId",
    {
      schema: {
        params: organizationMemberValidator.organizationMemberId,
      },
      preHandler: [authorize.role()],
    },
    organizationMemberController.delete,
  );
};
