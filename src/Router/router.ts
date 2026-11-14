import type { FastifyInstance } from "fastify";
import { userRouter } from "./user.router";
import { authRouter } from "./auth.router";
import { verificationRouter } from "./verification.router";
import { organizationRouter } from "./organization.router";
import { organizationMemberRouter } from "./organizationMember.router";
import { organizationInvitationRouter } from "./organizationInvitation.router";
import { clientsRouter } from "./clients.router";
import { dealRouter } from "./deal.router";
import { taskRouter } from "./task.router";
import { activityRouter } from "./activity.router";
import { notificationRouter } from "./notification.router";
import { auditLogRouter } from "./auditLog.router";
import { messageRouter } from "./message.router";
import { conversationRouter } from "./conversation.router";
import { conversationMemberRouter } from "./conversationMember.router";
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
  app.register(conversationRouter, { prefix: "/conversations" })
  app.register(conversationMemberRouter, { prefix: "/:conversationId/conversation-members" })
  app.register(messageRouter, { prefix: "/:conversationId/messages" })
  app.register(auditLogRouter, { prefix: "/:organizationId/audit-log" });
  app.register(notificationRouter, { prefix: "/notification" })
};
