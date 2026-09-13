import type { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";
import { UserValidator } from "../Validators/UserValidator";
import { authenticate } from "../Hooks/AuthenticationHook";
export const UserRouter = async (app: FastifyInstance) => {
  app.post(
    "/signup",
    { schema: { body: UserValidator.signupValidator } },
    UserController.signup,
  );
  app.post(
    "/login",
    { schema: { body: UserValidator.loginValidator } },
    UserController.login,
  );
  app.patch(
    "/update",
    {
      schema: { body: UserValidator.updateValidator },
      preHandler: authenticate.user,
    },
    UserController.update,
  );
  app.patch(
    "/password-reset",
    {
      schema: { body: UserValidator.passwordResetValidator },
      preHandler: authenticate.user,
    },
    UserController.passwordReset,
  );
};
