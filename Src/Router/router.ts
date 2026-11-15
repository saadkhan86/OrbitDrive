import type { FastifyInstance } from "fastify";
import { authRouter } from "../Modules/Auth/auth.router";
import { verificationRouter } from "../Modules/Verification/verification.router";
import { userRouter } from "../Modules/User/user.router";
import { organizationRouter } from "../Modules/Organization/organization.router";
import { organizationInvitationRouter } from "../Modules/OrganizationInvitations/organizationInvitation.router";
import { organizationMemberRouter } from "../Modules/OrganizationMember/organizationMember.router";
import { clientsRouter } from "../Modules/Clients/clients.router";
import { dealRouter } from "../Modules/Deal/deal.router";
import { taskRouter } from "../Modules/Task/task.router";
import { activityRouter } from "../Modules/Activity/activity.router";
import { conversationRouter } from "../Modules/Conversation/conversation.router";
import { conversationMemberRouter } from "../Modules/ConversationMember/conversationMember.router";
import { messageRouter } from "../Modules/Message/message.router";
import { auditLogRouter } from "../Modules/AuditLog/auditLog.router";
import { notificationRouter } from "../Modules/Notification/notification.router";

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
