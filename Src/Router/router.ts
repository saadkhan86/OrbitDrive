import type { FastifyInstance } from "fastify";
import { userRouter } from "./user.Router";
import { authRouter } from "./auth.Router";
import { verificationRouter } from "./verification.Router";
import { organizationRouter } from "./organization.Router";
import { organizationMemberRouter } from "./organizationMember.Router";
import { organizationInvitationRouter } from "./organizationInvitation.Router";
import { clientsRouter } from "./clients.Router";
export const router = async (app: FastifyInstance) => {
  app.register(authRouter, { prefix: "/auth" });
  app.register(userRouter, { prefix: "/user" });
  app.register(verificationRouter, { prefix: "/verification" });
  app.register(organizationRouter, { prefix: "/organization" });
  app.register(organizationInvitationRouter, {
    prefix: "/organization-invitation",
  });
  app.register(organizationMemberRouter, {
    prefix: "/:organizationId/organization-member",
  });
  app.register(clientsRouter, { prefix: "/:organizationId/clients" });
};
