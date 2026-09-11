"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const responseTimeHook_1 = require("./Hooks/responseTimeHook");
const Router_1 = require("./Router/Router");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const dotenv_1 = require("dotenv");
const GlobalErrorHandler_1 = require("./Errors/GlobalErrorHandler");
const JWTPlugin_1 = require("./Plugin/JWTPlugin");
const StartServer_1 = require("./Config/StartServer");
(0, dotenv_1.config)();
const server = (0, fastify_1.default)({
    logger: true,
});
server.register(responseTimeHook_1.responseTimeHook);
server.register(JWTPlugin_1.JWTPlugin);
server.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
server.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
server.setErrorHandler(GlobalErrorHandler_1.GlobalErrorHandler);
server.get("/ping", function (request, reply) {
    return {
        message: "pong",
    };
});
server.register(Router_1.Router);
(0, StartServer_1.StartServer)(server);
//# sourceMappingURL=server.js.map