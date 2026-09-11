"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTimeHook = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const responseTimeHookPlugin = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.decorateRequest("startTime", 0);
    app.addHook("onRequest", (request) => __awaiter(void 0, void 0, void 0, function* () {
        request.startTime = performance.now();
    }));
    app.addHook("onSend", (request, reply, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const duration = performance.now() - request.startTime;
        reply.raw.setHeader("X-Response-Time", `${duration.toFixed(2)}ms`);
        return payload;
    }));
});
exports.responseTimeHook = (0, fastify_plugin_1.default)(responseTimeHookPlugin);
//# sourceMappingURL=responseTimeHook.js.map