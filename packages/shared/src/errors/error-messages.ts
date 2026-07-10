export const ErrorMessages: Record<string, { message: string; statusCode: number }> = {
  INVALID_CREDENTIALS: {
    message: 'Invalid email or password.',
    statusCode: 401
  },
  EMAIL_ALREADY_EXISTS: {
    message: 'This email is already registered.',
    statusCode: 400
  },
  USER_NOT_FOUND: {
    message: 'No user found with this email.',
    statusCode: 404
  },
  PASSWORD_TOO_WEAK: {
    message: 'Password does not meet security requirements.',
    statusCode: 400
  },
  FIELD_VALIDATION_ERROR: {
    message: 'One or more fields are invalid.',
    statusCode: 400
  },
  USENAME_AND_PASSWORD_REQUIRED: {
    message: 'Username and password are required.',
    statusCode: 400
  },
  UNAUTHORIZED: {
    message: 'You are not authorized to access this resource.',
    statusCode: 401
  },
  FORBIDDEN: {
    message: 'You do not have permission to perform this action.',
    statusCode: 403
  },
  RESOURCE_NOT_FOUND: {
    message: 'Requested resource was not found.',
    statusCode: 404
  },
  USER_EXISTS: {
    message: 'User already exists.',
    statusCode: 409
  },
  TOO_MANY_REQUESTS: {
    message: 'Too many attempts. Please try again later.',
    statusCode: 429
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Something went wrong on our side.',
    statusCode: 500
  },
  TOKEN_EXPIRED: {
    message: 'Session has expired. Please log in again.',
    statusCode: 401
  },
  INVALID_TOKEN: {
    message: 'Invalid or malformed token.',
    statusCode: 401
  },
  MISSING_FIELDS: {
    message: 'Please fill in all required fields.',
    statusCode: 400
  },
  INVALID_REFRESH_TOKEN: {
    message: 'Invalid refresh token.',
    statusCode: 401
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh token has expired. Please log in again.',
    statusCode: 401
  },
  REFRESH_TOKEN_REQUIRED: {
    message: 'Refresh token is required.',
    statusCode: 400
  },
  VALIDATION_ERROR: {
    message: 'Validation failed',
    statusCode: 400,
  }
} as const;

export type ErrorCode = keyof typeof ErrorMessages;