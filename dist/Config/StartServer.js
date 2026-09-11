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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartServer = void 0;
const Database_1 = require("../Database");
const StartServer = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Database_1.checkDatabaseConnection)();
    try {
        const port = yield app.listen({ port: 8080 });
        console.log(`🚀 Server running on ${port}`);
    }
    catch (error) {
        console.log("Server crashed due to Error " + error);
        process.exit(1);
    }
});
exports.StartServer = StartServer;
//# sourceMappingURL=StartServer.js.map