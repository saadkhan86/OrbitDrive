import Fastify from "fastify";
import { responseTimeHook } from "./Hooks/responseTimeHook";
import { Router } from "./Router/Router";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { config } from "dotenv";
import { GlobalErrorHandler } from "./Errors/GlobalErrorHandler";
import { JWTPlugin } from "./Plugin/JWTPlugin";
import { StartServer } from "./Config/StartServer";
import { sendEmailVerificationEmail } from "./Services/Email.Service";

config();

const server = Fastify({
  logger: true,
});

server.register(responseTimeHook);
server.register(JWTPlugin);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler(GlobalErrorHandler);

server.get("/ping", async function (request, reply) {
  await sendEmailVerificationEmail(
    "sk8613013@gmail.com",
    "hghghjgjgtdrddbvcvbcbv",
    Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN),
    "Saad Muhammad Bin Ramzan"
  );
  return {
    message: "pong",
  };
});

server.register(Router);

StartServer(server);
