import Fastify from "fastify";
import { responseTimeHook } from "./Hooks/responseTimeHook";
import { Router } from "./Router/Router";
import { serializerCompiler,validatorCompiler } from "fastify-type-provider-zod";

const server = Fastify({ logger: true });

server.register(responseTimeHook);

server.setValidatorCompiler(validatorCompiler);

server.setSerializerCompiler(serializerCompiler);

server.get("/ping",function (request, reply) {
    return { message: "pong" };
})

server.register(Router)

server.listen({ port: 8080 }, (error, port) => {
    if (error) {
        server.log.error(`An error occured ${error.message}`)
        process.exit(1);
    }
})