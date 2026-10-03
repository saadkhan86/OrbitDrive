import { FastifyInstance } from "fastify";
import { authValidator } from "../Validators/auth.Validator";
import { authController } from "../Controller/auth.Controller";

export const authRouter = async (app: FastifyInstance) => {
  app.post(
    "/signup",
    { schema: { body: authValidator.signup } },
    authController.signup,
  );
  app.post(
    "/login",
    { schema: { body: authValidator.login } },
    authController.login,
  );
  app.post(
    "/forgot-password",
    {
      schema: { body: authValidator.email },
    },
    authController.forgotPassword,
  );
  app.patch(
    "/reset-password",
    {
      schema: { body: authValidator.passwordReset },
    },
    authController.passwordReset,
  );
  app.post(
    "/refresh",
    {
      schema: {
        body: authValidator.refreshToken,
      },
    },
    authController.refresh,
  );
};
