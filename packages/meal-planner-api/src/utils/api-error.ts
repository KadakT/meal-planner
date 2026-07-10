// utils/api-error.ts
import { ErrorCode, ErrorMessages } from "@meal-planner/shared";

export class ApiError extends Error {
  statusCode: number;
  errorCode: ErrorCode;
  details?: unknown;

  constructor(code: ErrorCode, details?: unknown) {
    super(ErrorMessages[code].message);

    this.statusCode = ErrorMessages[code].statusCode;
    this.errorCode = code;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
