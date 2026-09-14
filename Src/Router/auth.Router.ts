import { FastifyInstance } from "fastify";
import { userValidator } from "../Validators/user.Validator";
import { authenticate } from "../Hooks/AuthenticationHook";
import { emailValidator } from "../Validators/email.Validator";
import { authController } from "../Controller/auth.Controller";

export const authRouter = async (app: FastifyInstance) => {
  app.post(
    "/signup",
    { schema: { body: userValidator.signupValidator } },
    authController.signup,
  );
  app.post(
    "/login",
    { schema: { body: userValidator.loginValidator } },
    authController.login,
  );
  app.post(
    "/forgot-password",
    {
      schema: { body: emailValidator.emailSchema },
    },
    authController.forgotPassword,
  );
  app.patch(
    "/password-reset",
    {
      schema: { body: userValidator.passwordResetValidator },
      preHandler: authenticate.user,
    },
    authController.passwordReset,
  );
};
