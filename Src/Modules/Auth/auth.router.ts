import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import { authValidator } from "./auth.validator";
import { authenticate } from "../../Hooks/authentication.hook";

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
      config: { rateLimit: { max: 2, timeWindow: "1 minute" } },
      schema: { body: authValidator.email },
    },
    authController.forgotPassword,
  );
  app.patch(
    "/password-reset",
    {
      config: { rateLimit: { max: 1, timeWindow: "5 minute", } },
      schema: { body: authValidator.passwordReset },
    },
    authController.passwordReset,
  );
  app.post(
    "/refresh",
    {
      preHandler: [authenticate.user],
      config: {
        rateLimit: { max: 2, timeWindow: '1 minute' }
      },
      schema: {
        body: authValidator.refreshToken,
      },
    },
    authController.refresh,
  );
};
