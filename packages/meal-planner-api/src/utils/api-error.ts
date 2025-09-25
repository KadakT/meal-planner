// utils/api-error.ts
import { ErrorCode, ErrorMessages } from "@meal-planner/shared";

export class ApiError extends Error {
  statusCode: number;
  errorCode: ErrorCode;

  constructor(code: ErrorCode) {
    super(ErrorMessages[code].message);
    this.statusCode = ErrorMessages[code].statusCode;
    this.errorCode = code;
  }
}
