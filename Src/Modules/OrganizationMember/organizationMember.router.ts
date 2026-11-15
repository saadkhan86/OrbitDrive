import { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { organizationMemberController } from "./organizationMember.controller";
import { authorize } from "../../Hooks/authorization.hook";
import { organizationMemberValidator } from "./organizationMember.validator";

export const organizationMemberRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["organization Member"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.get("/", organizationMemberController.getForCurrentUser)
  app.get(
    "/:organizationId",
    {
      schema: { params: organizationMemberValidator.organizationId, querystring: organizationMemberValidator.query },
      preHandler: [authorize.role()],
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
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: organizationMemberValidator.memberId,
        body: organizationMemberValidator.role,
      },
      preHandler: [authorize.role(["owner", "admin"]), authorize.manageMember()],
    },
    organizationMemberController.update,
  );
  app.delete(
    "/:organizationId/:organizationMemberId",
    {
      config: { rateLimit: { max: 30, timeWindow: "1 minute" } },
      schema: {
        params: organizationMemberValidator.memberId,
      },
      preHandler: [authorize.role(["owner", "admin"]), authorize.manageMember()],
    },
    organizationMemberController.delete,
  );
};
