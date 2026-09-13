import type { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";
import { UserValidator } from "../Validators/UserValidator";
import { string } from "zod";

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
    { schema: { body: UserValidator.updateValidator } },
    UserController.update,
  );
  app.patch(
    "/reset-password/:token",
    {
      schema: {
        body: { password: string().min(6).max(32) },
        params: { token: string() },
      },
    },
    UserController.passwordReset,
  );
};
