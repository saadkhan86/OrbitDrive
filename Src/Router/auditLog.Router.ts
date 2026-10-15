import { FastifyInstance } from "fastify";
import { auditLogController } from "../Controller/auditLog.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authorize } from "../Hooks/authorization.Hook";

export const auditLogRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.addHook("preHandler", authorize.role(["ADMIN"]));
  app.get("/", auditLogController.findAll);
  app.get("/:auditLogId", auditLogController.findById);
};
