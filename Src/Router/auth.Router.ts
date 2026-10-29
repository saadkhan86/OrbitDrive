import { FastifyInstance } from "fastify";
import { authValidator } from "../Validators/auth.Validator";
import { authController } from "../Controller/auth.Controller";

export const authRouter = async (app: FastifyInstance) => {
  app.addHook("onRoute", (route) => {
    route.schema = { ...route.schema, tags: ["auth"] };
  });
  app.post(
    "/signup",
    { config: { rateLimit: { max: 3, timeWindow: "1 minute" } }, schema: { body: authValidator.signup } },
    authController.signup,
  );
  app.post(
    "/login",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } }, schema: { body: authValidator.login } },
    authController.login,
  );
  app.post(
    "/forgot-password",
    {
      config: { rateLimit: { max: 1, timeWindow: "3 minute" } },
      schema: { body: authValidator.email },
    },
    authController.forgotPassword,
  );
  app.patch(
    "/reset-password",
    {
      config: { rateLimit: { max: 1, timeWindow: "5 minute", } },
      schema: { body: authValidator.passwordReset },
    },
    authController.passwordReset,
  );
  app.post(
    "/refresh",
    {
      config: {
        rateLimit: { max: 1, timeWindow: '5 minute' }
      },
      schema: {
        body: authValidator.refreshToken,
      },
    },
    authController.refresh,
  );
};
