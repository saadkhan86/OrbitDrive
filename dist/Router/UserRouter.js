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
exports.UserRouter = UserRouter;
const UserController_1 = require("../Controller/UserController");
const UserValidator_1 = require("../Validators/UserValidator");
function UserRouter(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post("/signup", { schema: { body: UserValidator_1.Uservalidator.signupValidator } }, UserController_1.UserController.signup);
        app.post("/login", { schema: { body: UserValidator_1.Uservalidator.loginValidator } }, UserController_1.UserController.login);
        app.patch("/update", { schema: { body: UserValidator_1.Uservalidator.updateValidator } }, UserController_1.UserController.update);
    });
}
//# sourceMappingURL=UserRouter.js.map