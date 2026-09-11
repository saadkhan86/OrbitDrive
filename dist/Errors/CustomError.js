"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map