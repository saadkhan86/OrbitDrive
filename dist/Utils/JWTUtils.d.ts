import { FastifyInstance } from "fastify";
export declare const CreateJWTUtils: (app: FastifyInstance) => Promise<{
    generateAccessToken: (id: string) => string;
    generateRefreshToken: (id: string) => string;
}>;
export type JWTUtils = ReturnType<typeof CreateJWTUtils>;
//# sourceMappingURL=JWTUtils.d.ts.map