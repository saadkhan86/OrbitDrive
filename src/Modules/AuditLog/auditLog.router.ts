import { FastifyInstance } from "fastify";
import { authenticate } from "../../Hooks/authentication.hook";
import { authorize } from "../../Hooks/authorization.hook";
import { auditLogController } from "./auditLog.controller";

export const auditLogRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["Audit Logs"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.addHook("preHandler", authorize.role(["admin", "owner"]));
  app.get("/", auditLogController.query);
  app.get("/:auditLogId", auditLogController.findById);
};
