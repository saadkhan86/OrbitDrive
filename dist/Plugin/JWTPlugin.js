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
exports.JWTPlugin = void 0;
const jwt_1 = __importDefault(require("@fastify/jwt"));
const JWTUtils_1 = require("../Utils/JWTUtils");
const JWTPlugin = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield app.register(jwt_1.default, { secret: process.env.JWT_SECRET_KEY });
    const jwtUtils = yield (0, JWTUtils_1.CreateJWTUtils)(app);
    app.decorate("jwtUtils", jwtUtils);
});
exports.JWTPlugin = JWTPlugin;
//# sourceMappingURL=JWTPlugin.js.map