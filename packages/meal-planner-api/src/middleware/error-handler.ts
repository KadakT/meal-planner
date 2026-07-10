import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    const apiError = new ApiError('VALIDATION_ERROR', details);

    return res.status(apiError.statusCode).json({
      errorCode: apiError.errorCode,
      message: apiError.message,
      details: apiError.details,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
    });
  }

  const fallbackError = new ApiError('INTERNAL_SERVER_ERROR');

  return res.status(fallbackError.statusCode).json({
    errorCode: fallbackError.errorCode,
    message: fallbackError.message,
  });
};