import type { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";
import { UserValidator } from "../Validators/UserValidator";

export async function UserRouter(app: FastifyInstance) {
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
}
