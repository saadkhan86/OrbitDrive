import Fastify from "fastify";
import { responseTimeHook } from "./Hooks/responseTimeHook";

const server = Fastify({ logger: true });
server.register(responseTimeHook);
server.get("/ping", function (request, reply) {
    return { message: "pong" };
})

server.listen({ port: 8080 }, (error, port) => {
    if (error) {
        server.log.error(`An error occured ${error.message}`)
        process.exit(1);
    }
})