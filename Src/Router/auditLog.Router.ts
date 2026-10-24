import { FastifyInstance } from "fastify";
import { auditLogController } from "../Controller/auditLog.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";

export const auditLogRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["Audit Logs"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.addHook("preHandler", authorize.role(["admin", "owner"]));
  app.get("/", auditLogController.query);
  app.get("/:auditLogId", auditLogController.findById);
};
