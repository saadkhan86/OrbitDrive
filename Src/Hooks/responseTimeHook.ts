import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    startTime: number;
  }
}

const responseTimeHookPlugin: FastifyPluginAsync = async (app) => {

  app.decorateRequest("startTime", 0);

  app.addHook("onRequest", async (request) => {
    request.startTime = performance.now();
  });

  app.addHook("onSend", async (request, reply, payload) => {
    const duration = performance.now() - request.startTime;

    reply.raw.setHeader(
      "X-Response-Time",
      `${duration.toFixed(2)}ms`
    );

    return payload;
  });
};

export const responseTimeHook = fp(responseTimeHookPlugin);
