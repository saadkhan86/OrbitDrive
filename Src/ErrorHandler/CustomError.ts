export const Error_MAP = {
  BAD_REQUEST: { status: 400, message: "invalid input" },
  UNAUTHORIZED: { status: 401, message: "invalid or expired token" },
  FORBIDDEN: { status: 403, message: "permission denied" },
  NOT_FOUND: { status: 404, message: "not found" },
  CONFLICT: { status: 409, message: "already exist" },
  INTERNAL_ERROR: { status: 500, message: "internal server error" }
} as const;
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
