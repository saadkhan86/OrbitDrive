import type { FastifyInstance } from "fastify";
import { userController } from "../Controller/user.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authValidator } from "../Validators/auth.Validator";
export const userRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["user"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.get("/me", userController.me);
  app.patch(
    "/update",
    {
      schema: { body: authValidator.update },
    },
    userController.update,
  );
};
