import type { FastifyInstance } from "fastify";
import { userRouter } from "./user.Router";
import { authRouter } from "./auth.Router";
import { verificationRouter } from "./verification.Router";
import { organizationRouter } from "./organization.Router";
import { organizationMemberRouter } from "./organizationMember.Router";
import { organizationInvitationRouter } from "./organizationInvitation.Router";
import { clientsRouter } from "./clients.Router";
import { dealRouter } from "./deal.Router";
import { taskRouter } from "./task.Router";
import { activityRouter } from "./activity.Router";
import { notificationRouter } from "./notification.Router";
import { auditLogRouter } from "./auditLog.Router";
export const router = async (app: FastifyInstance) => {
  app.get("/ping", async function (request, reply) {
    return {
      message: "pong",
    };
  });
  app.register(authRouter, { prefix: "/auth" });
  app.register(verificationRouter, { prefix: "/verification" });
  app.register(userRouter, { prefix: "/users" });
  app.register(organizationRouter, { prefix: "/organization" });
  app.register(organizationInvitationRouter, {
    prefix: "/organization-invitation",
  });
  app.register(organizationMemberRouter, {
    prefix: "/organization-member",
  });
  app.register(clientsRouter, { prefix: "/:organizationId/client" });
  app.register(dealRouter, { prefix: "/:organizationId/deal" });
  app.register(taskRouter, { prefix: "/:organizationId/task" });
  app.register(activityRouter, { prefix: "/:organizationId/activity" });
  app.register(auditLogRouter, { prefix: "/:organizationId/audit-log" });
  app.register(notificationRouter, { prefix: "/notification" })
};
