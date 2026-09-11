import { FastifyPluginAsync } from "fastify";
declare module "fastify" {
    interface FastifyRequest {
        startTime: number;
    }
}
export declare const responseTimeHook: FastifyPluginAsync;
//# sourceMappingURL=responseTimeHook.d.ts.map