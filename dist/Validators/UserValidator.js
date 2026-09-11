"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uservalidator = void 0;
const zod_1 = __importDefault(require("zod"));
exports.Uservalidator = {
    signupValidator: zod_1.default.object({
        fullName: zod_1.default
            .string({
            error: (issue) => issue.code === "invalid_type"
                ? `This ${issue.path} should be of type ${issue.expected}`
                : `This ${issue.path} is required`,
        })
            .min(3, { message: `fullName must be greater than 3 characters` })
            .max(50, { message: "fullName must be smaller than 50 characters" }),
        email: zod_1.default.email(),
        password: zod_1.default
            .string()
            .min(6, { message: "password must be greater than 5 characters" })
            .max(30, { message: "password must be smaller than 30 characters" }),
    }),
    loginValidator: zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().min(6).max(30),
    }),
    updateValidator: zod_1.default.object({
        fullName: zod_1.default
            .string({
            error: (issue) => issue.code === "invalid_type"
                ? `This ${issue.path} should be of type ${issue.expected}`
                : `This ${issue.path} is required`,
        })
            .min(3, { message: `fullName must be greater than 3 characters` })
            .max(50, { message: "fullName must be smaller than 50 characters" })
            .optional(),
    }),
};
//# sourceMappingURL=UserValidator.js.map