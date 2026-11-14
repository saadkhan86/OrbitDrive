import type { FastifyInstance } from "fastify";
import { userController } from "./user.controller";
import { authenticate } from "../../Hooks/authentication.hook";
import { authValidator } from "../Auth/auth.validator";
import { userValidator } from "./user.validator";
export const userRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["user"] };
  });
  app.addHook("preHandler", authenticate.user);
  app.get("/me", userController.me);
  app.patch(
    "/update",
    {
      schema: { body: userValidator.update },
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
