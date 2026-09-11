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
exports.UserController = void 0;
const User_Service_1 = require("../Services/User.Service");
exports.UserController = {
    signup: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        return reply.status(201).send({
            message: "User created successfully",
            user: yield User_Service_1.UserService.signup(request.body, request.server.jwtUtils),
        });
    }),
    login: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        return reply.status(200).send({
            message: "User logged in successfully",
            user: yield User_Service_1.UserService.login(request.body),
        });
    }),
    update: (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        // const { fullName } = request.body as UpdateValidator;
        // if (!fullName || fullName == undefined || fullName == null)
        //   return reply
        //     .status(200)
        //     .send({ message: "user updated successfully", data: request.user! });
        const user = yield User_Service_1.UserService.update(request.body);
        return reply
            .status(200)
            .send({ message: "User updated successfully", user });
    }),
};
//# sourceMappingURL=UserController.js.map