/**
 * Custom Error Classes for Aplikasi Jurnal Mengajar Modern
 * Provides structured error handling across the application
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly for proper instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error for invalid input data
 * Used when user input fails validation rules
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not found error for missing resources
 * Used when requested resource doesn't exist in database
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} tidak ditemukan`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Unauthorized error for authentication/authorization failures
 * Used when user lacks permission to access resource
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Akses tidak diizinkan') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden error for authorized but insufficient permissions
 * Used when authenticated user doesn't have required role
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Anda tidak memiliki izin untuk mengakses resource ini') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Conflict error for duplicate or conflicting data
 * Used when operation conflicts with existing data
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Database error for database operation failures
 * Used when database operations fail unexpectedly
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Terjadi kesalahan pada database') {
    super(500, message, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Helper function to check if error is operational
 * Operational errors are expected and handled gracefully
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Helper function to format error response
 * Provides consistent error response structure
 */
export function formatErrorResponse(error: Error) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    };
  }

  // For unexpected errors, don't expose internal details
  return {
    success: false,
    error: {
      message: 'Terjadi kesalahan pada server',
      statusCode: 500,
    },
  };
}
