import type { FastifyInstance } from "fastify";
import { userController } from "../Controller/user.Controller";
import { userValidator } from "../Validators/user.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
export const userRouter = async (app: FastifyInstance) => {
  app.addHook("preHandler", authenticate.user);
  app.get("/me", userController.me);
  app.patch(
    "/update",
    {
      schema: { body: userValidator.updateValidator },
    },
    userController.update,
  );
};
