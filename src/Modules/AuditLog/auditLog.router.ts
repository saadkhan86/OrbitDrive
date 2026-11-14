import { FastifyInstance } from "fastify";
import { auditLogController } from "../controller/auditLog.controller";
import { authenticate } from "../hooks/authentication.hook";
import { authorize } from "../hooks/authorization.hook";

export const auditLogRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["Audit Logs"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.addHook("preHandler", authorize.role(["admin", "owner"]));
  app.get("/", auditLogController.query);
  app.get("/:auditLogId", auditLogController.findById);
};
