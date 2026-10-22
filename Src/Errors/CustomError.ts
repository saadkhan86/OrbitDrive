export class CustomError extends Error {
  statusCode: number;
  message: string;
  code: string;
  constructor(statusCode: number, message: string, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
