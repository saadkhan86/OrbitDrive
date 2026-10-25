import type { FastifyInstance } from "fastify";
import { userController } from "../Controller/user.Controller";
import { authenticate } from "../Hooks/AuthenticationHook";
import { authValidator } from "../Validators/auth.Validator";
import { userValidator } from "../Validators/user.Validator";
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
  app.get("/logout", userController.logout);
  app.get("/query", {
    schema: {
      querystring: userValidator.query
    }
  }, userController.query)
};
