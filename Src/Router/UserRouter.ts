import type { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";
import { Uservalidator } from "../Validators/UserValidator";

export async function UserRouter(app: FastifyInstance) {
  app.post(
    "/signup",
    { schema: { body: Uservalidator.signupValidator } },
    UserController.signup,
  );
  app.post(
    "/login",
    { schema: { body: Uservalidator.loginValidator } },
    UserController.login,
  );
  app.get(
    "/me",
    { schema: { body: Uservalidator.updateValidator } },
    UserController.update,
  );
}
