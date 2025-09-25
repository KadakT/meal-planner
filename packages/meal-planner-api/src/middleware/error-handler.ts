import { NextFunction, Response, Request } from "express";
import { ApiError } from "../utils/api-error";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong.',
  });
};
